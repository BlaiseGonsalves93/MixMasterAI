import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useCocktails } from "@/context/CocktailContext";
import { Heart, Clock, ArrowRight, FlaskConical } from "lucide-react";
import { CocktailWithMatchData } from "@/lib/types";

interface CocktailCardProps {
  cocktail: CocktailWithMatchData;
  onClick?: () => void;
}

export default function CocktailCard({ cocktail, onClick }: CocktailCardProps) {
  const { selectedIngredients, openModal, isCocktailSaved, toggleSaveCocktail } = useCocktails();

  // Format the match percentage
  const matchPercentage = useMemo(() => {
    return Math.round(cocktail.matchScore * 100);
  }, [cocktail.matchScore]);

  // Parse ingredients for display
  const ingredients = useMemo(() => {
    if (Array.isArray(cocktail.ingredients)) {
      return cocktail.ingredients;
    }
    try {
      return JSON.parse(cocktail.ingredients as string);
    } catch {
      return [];
    }
  }, [cocktail.ingredients]);

  return (
    <Card className="bg-muted rounded-xl overflow-hidden shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative h-48">
        <img 
          src={cocktail.imageUrl || `https://source.unsplash.com/800x500/?cocktail,${encodeURIComponent(cocktail.name)}`} 
          alt={`${cocktail.name} cocktail`} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = `https://source.unsplash.com/800x500/?cocktail,${encodeURIComponent(cocktail.name)}`;
          }}
        />
        <div className="absolute top-0 right-0 m-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveCocktail(cocktail);
            }}
            className={`p-1.5 rounded-full transition ${
              isCocktailSaved(cocktail.id) 
                ? "bg-primary text-primary-foreground" 
                : "bg-background/40 text-foreground/80 hover:text-foreground"
            }`}
          >
            <Heart className="h-4 w-4" fill={isCocktailSaved(cocktail.id) ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-medium text-white">{cocktail.name}</h3>
            {matchPercentage > 0 && (
              <div className="flex items-center">
                <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                  {matchPercentage}% Match
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        {cocktail.totalIngredients > 0 && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <FlaskConical className="mr-1 h-4 w-4" />
            <span>
              {cocktail.matchedIngredients} of {cocktail.totalIngredients} ingredients available
            </span>
          </div>
        )}
        {ingredients.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {ingredients.map((ingredient: string, index: number) => {
              const isAvailable = selectedIngredients.some(
                selected => ingredient.toLowerCase().includes(selected.toLowerCase())
              );
              return (
                <span 
                  key={index}
                  className={`text-xs px-2 py-1 rounded ${
                    isAvailable 
                      ? "bg-primary/20 text-primary-foreground" 
                      : "bg-destructive/10 text-destructive/80 opacity-60"
                  }`}
                >
                  {ingredient}
                </span>
              );
            })}
          </div>
        )}
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" /> {5 + Math.floor(ingredients.length / 2)} min
          </div>
          <button 
            onClick={onClick ? onClick : () => openModal(cocktail)}
            className="text-primary hover:text-primary/90 text-sm font-medium flex items-center"
          >
            View Recipe <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    </Card>
  );
}
