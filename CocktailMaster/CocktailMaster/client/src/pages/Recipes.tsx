import { useState, useEffect } from "react";
import { searchCocktails } from "@/lib/cocktailApi";
import { Cocktail } from "@/lib/types";
import { useCocktails } from "@/context/CocktailContext";
import CocktailCard from "@/components/CocktailCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeModal from "@/components/RecipeModal";
import { Loader2 } from "lucide-react";

export default function Recipes() {
  const [popularCocktails, setPopularCocktails] = useState<Cocktail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openModal } = useCocktails();

  // Popular cocktail names
  const popularCocktailNames = [
    "Mojito",
    "Margarita",
    "Old Fashioned",
    "Martini",
    "Manhattan",
    "Cosmopolitan",
    "Negroni",
    "Daiquiri",
    "Whiskey Sour",
    "Moscow Mule",
    "Gin and Tonic",
    "Aperol Spritz"
  ];

  useEffect(() => {
    async function fetchPopularCocktails() {
      setIsLoading(true);
      try {
        // Fetch cocktails one by one to ensure we get all the popular ones
        const cocktails: Cocktail[] = [];
        for (const name of popularCocktailNames) {
          const results = await searchCocktails(name);
          // Add the first result for each name if it exists
          if (results.length > 0) {
            cocktails.push(results[0]);
          }
        }
        setPopularCocktails(cocktails);
      } catch (error) {
        console.error("Failed to fetch popular cocktails:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPopularCocktails();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-4">
            Popular Cocktail Recipes
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto">
            Discover classic and popular cocktails loved around the world. Browse these timeless recipes and find your next favorite drink.
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularCocktails.map((cocktail) => (
              <CocktailCard 
                key={cocktail.id}
                cocktail={{
                  ...cocktail,
                  matchScore: 0, // Set to 0 so match percentage won't display
                  matchedIngredients: 0,
                  totalIngredients: 0
                }}
                onClick={() => openModal(cocktail)}
              />
            ))}
          </div>
        )}
      </main>
      
      <RecipeModal />
      <Footer />
    </div>
  );
}