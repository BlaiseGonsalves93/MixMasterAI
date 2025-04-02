import { useCocktails } from "@/context/CocktailContext";
import CocktailCard from "@/components/CocktailCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown } from "lucide-react";
import { SortOption } from "@/lib/types";

export default function RecommendationResults() {
  const { 
    sortedRecommendations, 
    isLoadingRecommendations, 
    sortOption, 
    setSortOption
  } = useCocktails();

  // Only show if there are recommendations or if it's loading
  if (sortedRecommendations.length === 0 && !isLoadingRecommendations) {
    return null;
  }

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl md:text-3xl font-bold">Recommended Cocktails</h2>
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-muted-foreground">Sort by:</span>
          <Select 
            value={sortOption} 
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Relevance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="easiest">Easiest to make</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoadingRecommendations ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-[380px] rounded-xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {sortedRecommendations.slice(0, 6).map((cocktail) => (
              <CocktailCard key={cocktail.id} cocktail={cocktail} />
            ))}
          </div>
          
          {sortedRecommendations.length > 6 && (
            <div className="text-center">
              <button className="text-primary hover:text-primary/80 font-medium flex items-center mx-auto">
                Load More Recommendations <ArrowDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
