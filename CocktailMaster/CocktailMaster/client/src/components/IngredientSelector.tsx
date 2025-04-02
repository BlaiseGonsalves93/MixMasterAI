import { useState, useEffect } from "react";
import { useCocktails } from "@/context/CocktailContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { IngredientChip } from "@/components/ui/ingredient-chip";
import { Search, Wand2 } from "lucide-react";

export default function IngredientSelector() {
  const {
    allIngredients,
    isLoadingIngredients,
    selectedIngredients,
    selectIngredient,
    removeIngredient,
    searchQuery,
    setSearchQuery,
    getRecommendationsForIngredients,
    isLoadingRecommendations,
  } = useCocktails();

  const [filteredIngredients, setFilteredIngredients] = useState(allIngredients);

  // Filter ingredients based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredIngredients(allIngredients);
    } else {
      const filtered = allIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredIngredients(filtered);
    }
  }, [searchQuery, allIngredients]);

  return (
    <section className="mb-12" id="ingredient-selector">
      <div className="bg-muted/30 rounded-xl p-6 mb-8">
        <h3 className="font-serif text-xl font-medium mb-4">Select Your Available Ingredients</h3>
        <div className="mb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10"
            />
            <Search className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-medium text-muted-foreground mb-2">POPULAR INGREDIENTS</h4>
          <div className="flex flex-wrap gap-2">
            {isLoadingIngredients ? (
              Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))
            ) : (
              filteredIngredients.slice(0, 20).map((ingredient) => (
                <IngredientChip
                  key={ingredient.id}
                  name={ingredient.name}
                  selected={selectedIngredients.includes(ingredient.name)}
                  onClick={() => selectIngredient(ingredient.name)}
                />
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-muted-foreground mb-2">YOUR SELECTED INGREDIENTS</h4>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No ingredients selected yet</p>
            ) : (
              selectedIngredients.map((ingredient) => (
                <IngredientChip
                  key={ingredient}
                  name={ingredient}
                  selected
                  onRemove={() => removeIngredient(ingredient)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button
          onClick={getRecommendationsForIngredients}
          disabled={selectedIngredients.length === 0 || isLoadingRecommendations}
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition shadow-lg"
          size="lg"
        >
          <Wand2 className="mr-2 h-5 w-5" />
          {isLoadingRecommendations ? "Finding Cocktails..." : "Find Cocktails"}
        </Button>
      </div>
    </section>
  );
}
