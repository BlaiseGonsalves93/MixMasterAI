import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const cocktails = pgTable("cocktails", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"),
  alcoholic: text("alcoholic"),
  glass: text("glass"),
  instructions: text("instructions").notNull(),
  imageUrl: text("image_url"),
  ingredients: jsonb("ingredients").notNull(),
  measurements: jsonb("measurements"),
  apiId: text("api_id").unique(),
});

export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  cocktailId: integer("cocktail_id").notNull().references(() => cocktails.id),
});

export const ingredients = pgTable("ingredients", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category"),
  alcoholic: boolean("alcoholic"),
});

export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  preferredIngredients: jsonb("preferred_ingredients").notNull(),
  dislikedIngredients: jsonb("disliked_ingredients").notNull(),
  flavor: text("flavor"), // sweet, sour, bitter, etc.
  strength: text("strength"), // light, medium, strong
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCocktailSchema = createInsertSchema(cocktails).omit({
  id: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
});

export const insertIngredientSchema = createInsertSchema(ingredients).omit({
  id: true,
});

export const insertUserPreferenceSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCocktail = z.infer<typeof insertCocktailSchema>;
export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type InsertIngredient = z.infer<typeof insertIngredientSchema>;
export type InsertUserPreference = z.infer<typeof insertUserPreferenceSchema>;

export type User = typeof users.$inferSelect;
export type Cocktail = typeof cocktails.$inferSelect;
export type Favorite = typeof favorites.$inferSelect;
export type Ingredient = typeof ingredients.$inferSelect;
export type UserPreference = typeof userPreferences.$inferSelect;

// Types for API data from external cocktail API
export type CocktailApiResponse = {
  drinks: CocktailApiDrink[] | null;
};

export type CocktailApiDrink = {
  idDrink: string;
  strDrink: string;
  strCategory?: string;
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions: string;
  strDrinkThumb?: string;
  strIngredient1?: string;
  strIngredient2?: string;
  strIngredient3?: string;
  strIngredient4?: string;
  strIngredient5?: string;
  strIngredient6?: string;
  strIngredient7?: string;
  strIngredient8?: string;
  strIngredient9?: string;
  strIngredient10?: string;
  strIngredient11?: string;
  strIngredient12?: string;
  strIngredient13?: string;
  strIngredient14?: string;
  strIngredient15?: string;
  strMeasure1?: string;
  strMeasure2?: string;
  strMeasure3?: string;
  strMeasure4?: string;
  strMeasure5?: string;
  strMeasure6?: string;
  strMeasure7?: string;
  strMeasure8?: string;
  strMeasure9?: string;
  strMeasure10?: string;
  strMeasure11?: string;
  strMeasure12?: string;
  strMeasure13?: string;
  strMeasure14?: string;
  strMeasure15?: string;
};

export const recommendationSchema = z.object({
  ingredients: z.array(z.string()),
});

export type RecommendationRequest = z.infer<typeof recommendationSchema>;
