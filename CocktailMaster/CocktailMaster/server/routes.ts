import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import axios from "axios";
import { recommendationSchema, type CocktailApiResponse, type CocktailApiDrink } from "@shared/schema";
import * as tf from "@tensorflow/tfjs-node";

const COCKTAIL_DB_API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all ingredients
  app.get("/api/ingredients", async (req: Request, res: Response) => {
    try {
      const ingredients = await storage.getAllIngredients();
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch ingredients" });
    }
  });

  // Search cocktails by name
  app.get("/api/cocktails/search", async (req: Request, res: Response) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const response = await axios.get<CocktailApiResponse>(`${COCKTAIL_DB_API_URL}/search.php?s=${query}`);
      if (!response.data.drinks) {
        return res.json([]);
      }

      // Save cocktails to local storage and return them
      const cocktails = await Promise.all(
        response.data.drinks.map(async (drink) => {
          let cocktail = await storage.getCocktailByApiId(drink.idDrink);
          if (!cocktail) {
            const insertCocktail = storage.convertApiToCocktail(drink);
            cocktail = await storage.createCocktail(insertCocktail);
          }
          return cocktail;
        })
      );

      res.json(cocktails);
    } catch (error) {
      res.status(500).json({ message: "Failed to search cocktails" });
    }
  });

  // Get random cocktail
  app.get("/api/cocktails/random", async (req: Request, res: Response) => {
    try {
      const response = await axios.get<CocktailApiResponse>(`${COCKTAIL_DB_API_URL}/random.php`);
      if (!response.data.drinks || response.data.drinks.length === 0) {
        return res.status(404).json({ message: "No cocktail found" });
      }

      const drink = response.data.drinks[0];
      let cocktail = await storage.getCocktailByApiId(drink.idDrink);
      if (!cocktail) {
        const insertCocktail = storage.convertApiToCocktail(drink);
        cocktail = await storage.createCocktail(insertCocktail);
      }

      res.json(cocktail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch random cocktail" });
    }
  });

  // Get cocktail by ID
  app.get("/api/cocktails/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cocktail ID" });
      }

      const cocktail = await storage.getCocktail(id);
      if (!cocktail) {
        return res.status(404).json({ message: "Cocktail not found" });
      }

      res.json(cocktail);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cocktail" });
    }
  });

  // Get cocktails by ingredient
  app.get("/api/cocktails/ingredient/:name", async (req: Request, res: Response) => {
    try {
      const ingredientName = req.params.name;
      
      const response = await axios.get<CocktailApiResponse>(
        `${COCKTAIL_DB_API_URL}/filter.php?i=${encodeURIComponent(ingredientName)}`
      );
      
      if (!response.data.drinks) {
        return res.json([]);
      }

      // For each cocktail in the list, fetch the full details
      const cocktails = await Promise.all(
        response.data.drinks.map(async (drink) => {
          let cocktail = await storage.getCocktailByApiId(drink.idDrink);
          
          if (!cocktail) {
            // Fetch detailed information about the cocktail
            const detailResponse = await axios.get<CocktailApiResponse>(
              `${COCKTAIL_DB_API_URL}/lookup.php?i=${drink.idDrink}`
            );
            
            if (detailResponse.data.drinks && detailResponse.data.drinks.length > 0) {
              const insertCocktail = storage.convertApiToCocktail(detailResponse.data.drinks[0]);
              cocktail = await storage.createCocktail(insertCocktail);
            }
          }
          
          return cocktail;
        })
      );

      // Filter out undefined values
      res.json(cocktails.filter(Boolean));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cocktails by ingredient" });
    }
  });

  // Get cocktail recommendations based on ingredients
  app.post("/api/recommendations", async (req: Request, res: Response) => {
    try {
      const validation = recommendationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: "Invalid request format", errors: validation.error.errors });
      }

      const { ingredients } = validation.data;
      if (!ingredients.length) {
        return res.status(400).json({ message: "At least one ingredient is required" });
      }

      // First, get cocktails from API for each ingredient
      const cocktailsPerIngredient = await Promise.all(
        ingredients.map(async (ingredient) => {
          try {
            const response = await axios.get<CocktailApiResponse>(
              `${COCKTAIL_DB_API_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
            );
            return response.data.drinks || [];
          } catch {
            return [];
          }
        })
      );

      // Flatten and deduplicate by ID
      const uniqueCocktails = new Map<string, CocktailApiDrink>();
      cocktailsPerIngredient.flat().forEach((drink) => {
        if (!uniqueCocktails.has(drink.idDrink)) {
          uniqueCocktails.set(drink.idDrink, drink);
        }
      });

      // Get full details for each cocktail and store them
      const cocktailDetails = await Promise.all(
        Array.from(uniqueCocktails.values()).map(async (drink) => {
          let cocktail = await storage.getCocktailByApiId(drink.idDrink);
          
          if (!cocktail) {
            try {
              const detailResponse = await axios.get<CocktailApiResponse>(
                `${COCKTAIL_DB_API_URL}/lookup.php?i=${drink.idDrink}`
              );
              
              if (detailResponse.data.drinks && detailResponse.data.drinks.length > 0) {
                const insertCocktail = storage.convertApiToCocktail(detailResponse.data.drinks[0]);
                cocktail = await storage.createCocktail(insertCocktail);
              }
            } catch {
              return null;
            }
          }
          
          return cocktail;
        })
      );

      // Filter out nulls
      const validCocktails = cocktailDetails.filter(Boolean);

      // Calculate match scores
      const matches = validCocktails.map((cocktail) => {
        if (!cocktail) return null;
        
        const cocktailIngredients = cocktail.ingredients as string[];
        const matchedIngredients = ingredients.filter((ingredient) => 
          cocktailIngredients.some((ci) => ci.toLowerCase().includes(ingredient.toLowerCase()))
        );
        
        const matchScore = matchedIngredients.length / cocktailIngredients.length;
        
        return {
          ...cocktail,
          matchScore,
          matchedIngredients: matchedIngredients.length,
          totalIngredients: cocktailIngredients.length
        };
      }).filter(Boolean);

      // Sort by match score, descending
      matches.sort((a, b) => b!.matchScore - a!.matchScore);

      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Game recommendations based on mood/preferences
  app.post("/api/game/recommend", async (req: Request, res: Response) => {
    try {
      const { mood, preferences } = req.body;
      
      // Simple mood to category mapping
      const moodCategories: Record<string, string> = {
        cheerful: "Cocktail",
        relaxed: "Ordinary Drink",
        adventurous: "Shot",
        sophisticated: "Coffee / Tea"
      };
      
      // Get a category based on mood, or random if mood not recognized
      let category = "";
      if (mood && moodCategories[mood]) {
        category = moodCategories[mood];
      }
      
      let apiUrl = `${COCKTAIL_DB_API_URL}/random.php`;
      if (category) {
        // Try to get a filtered drink first
        const categoryResponse = await axios.get<CocktailApiResponse>(
          `${COCKTAIL_DB_API_URL}/filter.php?c=${encodeURIComponent(category)}`
        );
        
        if (categoryResponse.data.drinks && categoryResponse.data.drinks.length) {
          // Pick a random drink from the category
          const randomIndex = Math.floor(Math.random() * categoryResponse.data.drinks.length);
          const randomDrink = categoryResponse.data.drinks[randomIndex];
          
          // Look up the full details
          apiUrl = `${COCKTAIL_DB_API_URL}/lookup.php?i=${randomDrink.idDrink}`;
        }
      }
      
      // Get the cocktail details
      const response = await axios.get<CocktailApiResponse>(apiUrl);
      
      if (!response.data.drinks || response.data.drinks.length === 0) {
        return res.status(404).json({ message: "No cocktail found" });
      }
      
      const drink = response.data.drinks[0];
      let cocktail = await storage.getCocktailByApiId(drink.idDrink);
      
      if (!cocktail) {
        const insertCocktail = storage.convertApiToCocktail(drink);
        cocktail = await storage.createCocktail(insertCocktail);
      }
      
      res.json(cocktail);
    } catch (error) {
      res.status(500).json({ message: "Failed to get game recommendation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
