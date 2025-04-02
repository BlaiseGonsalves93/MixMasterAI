import * as tf from "@tensorflow/tfjs";
import { Cocktail, Ingredient } from "./types";

// Simple model to recommend cocktails based on available ingredients
// This is a cosine similarity approach that simulates ML-style recommendations

export class RecommendationEngine {
  private model: tf.LayersModel | null = null;
  private ingredients: string[] = [];
  private cocktails: Cocktail[] = [];
  private vectorMap: Map<string, number[]> = new Map();
  
  constructor() {
    this.loadModel();
  }
  
  // Initialize the engine with available data
  async initialize(cocktails: Cocktail[], ingredients: string[]) {
    this.cocktails = cocktails;
    this.ingredients = ingredients;
    
    // Create vector representations of cocktails
    this.createVectorRepresentations();
    
    return true;
  }
  
  // Create vector representations of cocktails based on ingredients
  private createVectorRepresentations() {
    // Reset vector map
    this.vectorMap.clear();
    
    // For each cocktail, create a binary vector of ingredients
    this.cocktails.forEach(cocktail => {
      const vector = new Array(this.ingredients.length).fill(0);
      
      // Handle different formats of ingredients field
      const cocktailIngredients = Array.isArray(cocktail.ingredients) 
        ? cocktail.ingredients 
        : JSON.parse(cocktail.ingredients as string);
      
      // Mark 1 for each ingredient that exists in the cocktail
      cocktailIngredients.forEach((ingredient: string) => {
        const normalizedIngredient = ingredient.toLowerCase().trim();
        const index = this.ingredients.findIndex(ing => 
          normalizedIngredient.includes(ing.toLowerCase())
        );
        if (index !== -1) {
          vector[index] = 1;
        }
      });
      
      this.vectorMap.set(cocktail.id.toString(), vector);
    });
  }
  
  // Load TensorFlow.js model (simplified for this implementation)
  private async loadModel() {
    try {
      // In a real implementation, this would load a pre-trained model
      // For this example, we'll use the vector similarity approach instead
      await tf.ready();
      console.log("TensorFlow.js is ready");
    } catch (error) {
      console.error("Failed to initialize TensorFlow:", error);
    }
  }
  
  // Get recommendations based on available ingredients
  async getRecommendations(availableIngredients: string[], limit = 10): Promise<Cocktail[]> {
    // Create a binary vector for available ingredients
    const inputVector = new Array(this.ingredients.length).fill(0);
    availableIngredients.forEach(ingredient => {
      const index = this.ingredients.findIndex(ing => 
        ing.toLowerCase() === ingredient.toLowerCase()
      );
      if (index !== -1) {
        inputVector[index] = 1;
      }
    });
    
    // Calculate similarity scores
    const scores = this.cocktails.map(cocktail => {
      const cocktailVector = this.vectorMap.get(cocktail.id.toString()) || [];
      return {
        cocktail,
        score: this.cosineSimilarity(inputVector, cocktailVector),
        matchCount: this.countMatches(inputVector, cocktailVector)
      };
    });
    
    // Sort by score (higher is better)
    scores.sort((a, b) => {
      // First by match count
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      // Then by similarity score
      return b.score - a.score;
    });
    
    // Return top N cocktails
    return scores.slice(0, limit).map(item => ({
      ...item.cocktail,
      matchScore: item.score,
      matchedIngredients: item.matchCount,
      totalIngredients: (Array.isArray(item.cocktail.ingredients) 
        ? item.cocktail.ingredients 
        : JSON.parse(item.cocktail.ingredients as string)).length
    }));
  }
  
  // Calculate cosine similarity between two vectors
  private cosineSimilarity(a: number[], b: number[]): number {
    // If either vector is all zeros, similarity is 0
    if (a.every(val => val === 0) || b.every(val => val === 0)) {
      return 0;
    }
    
    // Calculate dot product
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    
    // Calculate magnitudes
    const aMagnitude = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const bMagnitude = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    
    // Calculate cosine similarity
    return dotProduct / (aMagnitude * bMagnitude);
  }
  
  // Count how many ingredients match
  private countMatches(available: number[], cocktail: number[]): number {
    return available.reduce((count, val, i) => {
      return count + (val === 1 && cocktail[i] === 1 ? 1 : 0);
    }, 0);
  }
}

export const recommendationEngine = new RecommendationEngine();
