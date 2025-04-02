export interface Ingredient {
  id: number;
  name: string;
  description?: string;
  category?: string;
  alcoholic?: boolean;
}

export interface CocktailIngredient {
  name: string;
  measure?: string;
  available: boolean;
}

export interface Cocktail {
  id: number;
  name: string;
  category?: string;
  alcoholic?: string;
  glass?: string;
  instructions: string;
  imageUrl?: string;
  ingredients: string[] | string;
  measurements?: string[] | string;
  apiId?: string;
  matchScore?: number;
  matchedIngredients?: number;
  totalIngredients?: number;
}

export interface CocktailWithMatchData extends Cocktail {
  matchScore: number;
  matchedIngredients: number;
  totalIngredients: number;
}

export type SortOption = "relevance" | "popularity" | "easiest";

export type GameMood = "cheerful" | "relaxed" | "adventurous" | "sophisticated";

export type ActiveTab = "ingredients" | "preference" | "surprise";
