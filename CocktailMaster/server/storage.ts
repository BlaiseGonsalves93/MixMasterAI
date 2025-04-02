import {
  users,
  type User,
  type InsertUser,
  cocktails,
  type Cocktail,
  type InsertCocktail,
  favorites,
  type Favorite,
  type InsertFavorite,
  ingredients,
  type Ingredient,
  type InsertIngredient,
  userPreferences,
  type UserPreference,
  type InsertUserPreference,
  type CocktailApiDrink
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Cocktail methods
  getCocktail(id: number): Promise<Cocktail | undefined>;
  getCocktailByApiId(apiId: string): Promise<Cocktail | undefined>;
  getAllCocktails(): Promise<Cocktail[]>;
  createCocktail(cocktail: InsertCocktail): Promise<Cocktail>;
  searchCocktails(query: string): Promise<Cocktail[]>;
  getCocktailsByIngredients(ingredientList: string[]): Promise<Cocktail[]>;
  
  // Favorite methods
  getFavorites(userId: number): Promise<Cocktail[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, cocktailId: number): Promise<boolean>;
  
  // Ingredient methods
  getIngredient(id: number): Promise<Ingredient | undefined>;
  getIngredientByName(name: string): Promise<Ingredient | undefined>;
  getAllIngredients(): Promise<Ingredient[]>;
  createIngredient(ingredient: InsertIngredient): Promise<Ingredient>;
  
  // User preference methods
  getUserPreference(userId: number): Promise<UserPreference | undefined>;
  createUserPreference(preference: InsertUserPreference): Promise<UserPreference>;
  updateUserPreference(userId: number, preference: Partial<InsertUserPreference>): Promise<UserPreference | undefined>;
  
  // Helper methods
  convertApiToCocktail(drink: CocktailApiDrink): InsertCocktail;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cocktails: Map<number, Cocktail>;
  private favorites: Map<number, Favorite>;
  private ingredients: Map<number, Ingredient>;
  private userPreferences: Map<number, UserPreference>;
  
  private currentUserId: number;
  private currentCocktailId: number;
  private currentFavoriteId: number;
  private currentIngredientId: number;
  private currentUserPreferenceId: number;

  constructor() {
    this.users = new Map();
    this.cocktails = new Map();
    this.favorites = new Map();
    this.ingredients = new Map();
    this.userPreferences = new Map();
    
    this.currentUserId = 1;
    this.currentCocktailId = 1;
    this.currentFavoriteId = 1;
    this.currentIngredientId = 1;
    this.currentUserPreferenceId = 1;
    
    // Initialize with some common ingredients
    const commonIngredients = [
      "Vodka", "Rum", "Gin", "Tequila", "Whiskey", "Bourbon", "Scotch", 
      "Brandy", "Cognac", "Triple Sec", "Cointreau", "Lime Juice", 
      "Lemon Juice", "Orange Juice", "Cranberry Juice", "Pineapple Juice", 
      "Grapefruit Juice", "Simple Syrup", "Grenadine", "Bitters", 
      "Mint Leaves", "Soda Water", "Tonic Water", "Cola", "Ginger Beer"
    ];
    
    commonIngredients.forEach(name => {
      this.createIngredient({
        name,
        description: `${name} is a common ingredient in cocktails.`,
        category: name.includes("Juice") ? "Juice" : name.includes("Syrup") ? "Syrup" : "Spirit",
        alcoholic: !name.includes("Juice") && !name.includes("Syrup") && !name.includes("Leaves") && !name.includes("Water") && !name.includes("Cola")
      });
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Cocktail methods
  async getCocktail(id: number): Promise<Cocktail | undefined> {
    return this.cocktails.get(id);
  }
  
  async getCocktailByApiId(apiId: string): Promise<Cocktail | undefined> {
    return Array.from(this.cocktails.values()).find(
      (cocktail) => cocktail.apiId === apiId
    );
  }
  
  async getAllCocktails(): Promise<Cocktail[]> {
    return Array.from(this.cocktails.values());
  }
  
  async createCocktail(insertCocktail: InsertCocktail): Promise<Cocktail> {
    const id = this.currentCocktailId++;
    const cocktail: Cocktail = { ...insertCocktail, id };
    this.cocktails.set(id, cocktail);
    return cocktail;
  }
  
  async searchCocktails(query: string): Promise<Cocktail[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.cocktails.values()).filter(
      (cocktail) => cocktail.name.toLowerCase().includes(lowerQuery)
    );
  }
  
  async getCocktailsByIngredients(ingredientList: string[]): Promise<Cocktail[]> {
    const lowerIngredients = ingredientList.map(i => i.toLowerCase());
    
    return Array.from(this.cocktails.values()).filter(cocktail => {
      // Check if the cocktail has at least one of the requested ingredients
      if (Array.isArray(cocktail.ingredients)) {
        const cocktailIngredients = cocktail.ingredients as string[];
        return cocktailIngredients.some(ingredient => 
          lowerIngredients.includes(ingredient.toLowerCase())
        );
      }
      return false;
    });
  }
  
  // Favorite methods
  async getFavorites(userId: number): Promise<Cocktail[]> {
    const userFavorites = Array.from(this.favorites.values()).filter(
      (favorite) => favorite.userId === userId
    );
    
    return userFavorites.map(favorite => 
      this.cocktails.get(favorite.cocktailId)
    ).filter((cocktail): cocktail is Cocktail => cocktail !== undefined);
  }
  
  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const favorite: Favorite = { ...insertFavorite, id };
    this.favorites.set(id, favorite);
    return favorite;
  }
  
  async removeFavorite(userId: number, cocktailId: number): Promise<boolean> {
    const favoriteId = Array.from(this.favorites.entries()).find(
      ([_, favorite]) => favorite.userId === userId && favorite.cocktailId === cocktailId
    )?.[0];
    
    if (favoriteId !== undefined) {
      return this.favorites.delete(favoriteId);
    }
    
    return false;
  }
  
  // Ingredient methods
  async getIngredient(id: number): Promise<Ingredient | undefined> {
    return this.ingredients.get(id);
  }
  
  async getIngredientByName(name: string): Promise<Ingredient | undefined> {
    return Array.from(this.ingredients.values()).find(
      (ingredient) => ingredient.name.toLowerCase() === name.toLowerCase()
    );
  }
  
  async getAllIngredients(): Promise<Ingredient[]> {
    return Array.from(this.ingredients.values());
  }
  
  async createIngredient(insertIngredient: InsertIngredient): Promise<Ingredient> {
    const id = this.currentIngredientId++;
    const ingredient: Ingredient = { ...insertIngredient, id };
    this.ingredients.set(id, ingredient);
    return ingredient;
  }
  
  // User preference methods
  async getUserPreference(userId: number): Promise<UserPreference | undefined> {
    return Array.from(this.userPreferences.values()).find(
      (preference) => preference.userId === userId
    );
  }
  
  async createUserPreference(insertPreference: InsertUserPreference): Promise<UserPreference> {
    const id = this.currentUserPreferenceId++;
    const preference: UserPreference = { ...insertPreference, id };
    this.userPreferences.set(id, preference);
    return preference;
  }
  
  async updateUserPreference(userId: number, updatedPreference: Partial<InsertUserPreference>): Promise<UserPreference | undefined> {
    const preference = await this.getUserPreference(userId);
    
    if (!preference) return undefined;
    
    const updated: UserPreference = {
      ...preference,
      ...updatedPreference
    };
    
    this.userPreferences.set(preference.id, updated);
    return updated;
  }
  
  // Helper methods
  convertApiToCocktail(drink: CocktailApiDrink): InsertCocktail {
    // Extract all ingredients and measurements
    const ingredients: string[] = [];
    const measurements: string[] = [];
    
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}` as keyof CocktailApiDrink] as string | undefined;
      const measure = drink[`strMeasure${i}` as keyof CocktailApiDrink] as string | undefined;
      
      if (ingredient && ingredient.trim()) {
        ingredients.push(ingredient.trim());
        measurements.push(measure?.trim() || '');
      }
    }
    
    return {
      name: drink.strDrink,
      category: drink.strCategory || '',
      alcoholic: drink.strAlcoholic || '',
      glass: drink.strGlass || '',
      instructions: drink.strInstructions,
      imageUrl: drink.strDrinkThumb || '',
      ingredients,
      measurements,
      apiId: drink.idDrink
    };
  }
}

export const storage = new MemStorage();
