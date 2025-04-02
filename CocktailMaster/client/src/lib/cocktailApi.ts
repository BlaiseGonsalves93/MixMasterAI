import { Cocktail, Ingredient, CocktailWithMatchData } from "./types";

// API functions for cocktail data
export async function getIngredients(): Promise<Ingredient[]> {
  try {
    const response = await fetch("/api/ingredients");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch ingredients:", error);
    throw error;
  }
}

export async function searchCocktails(query: string): Promise<Cocktail[]> {
  try {
    const response = await fetch(`/api/cocktails/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to search cocktails:", error);
    throw error;
  }
}

export async function getRandomCocktail(): Promise<Cocktail> {
  try {
    const response = await fetch("/api/cocktails/random");
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch random cocktail:", error);
    throw error;
  }
}

export async function getCocktailById(id: number): Promise<Cocktail> {
  try {
    const response = await fetch(`/api/cocktails/${id}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch cocktail with id ${id}:`, error);
    throw error;
  }
}

export async function getCocktailsByIngredient(ingredientName: string): Promise<Cocktail[]> {
  try {
    const response = await fetch(`/api/cocktails/ingredient/${encodeURIComponent(ingredientName)}`);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch cocktails with ingredient ${ingredientName}:`, error);
    throw error;
  }
}

export async function getRecommendations(ingredients: string[]): Promise<CocktailWithMatchData[]> {
  try {
    const response = await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ingredients }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get recommendations:", error);
    throw error;
  }
}

export async function getGameRecommendation(mood: string): Promise<Cocktail> {
  try {
    const response = await fetch("/api/game/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mood }),
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Failed to get game recommendation:", error);
    throw error;
  }
}
