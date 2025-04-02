import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IngredientSelector from "@/components/IngredientSelector";
import RecommendationResults from "@/components/RecommendationResults";
import GameSection from "@/components/GameSection";
import RecipeModal from "@/components/RecipeModal";
import CocktailCard from "@/components/CocktailCard";
import { useCocktails } from "@/context/CocktailContext";
import { FlaskConical, Heart, Dice5 } from "lucide-react";

export default function Home() {
  const { activeTab, setActiveTab, savedCocktails } = useCocktails();

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value as any);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Hero />
        
        <div className="mb-10">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <div className="border-b border-border">
              <TabsList className="bg-transparent border-b-0 h-auto">
                <TabsTrigger 
                  value="ingredients" 
                  className="font-medium text-sm py-4 rounded-none data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
                >
                  <FlaskConical className="mr-1 h-4 w-4" /> By Ingredients
                </TabsTrigger>
                <TabsTrigger 
                  value="preference" 
                  className="font-medium text-sm py-4 rounded-none data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
                >
                  <Heart className="mr-1 h-4 w-4" /> By Preference
                </TabsTrigger>
                <TabsTrigger 
                  value="surprise" 
                  className="font-medium text-sm py-4 rounded-none data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:text-foreground data-[state=inactive]:text-muted-foreground"
                >
                  <Dice5 className="mr-1 h-4 w-4" /> Surprise Me
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="ingredients">
              <IngredientSelector />
              <RecommendationResults />
            </TabsContent>
            
            <TabsContent value="preference">
              {savedCocktails.length === 0 ? (
                <div className="py-12 text-center bg-muted/30 rounded-xl mt-8">
                  <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-medium mb-2">No saved cocktails yet</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Save your favorite cocktails by clicking the heart icon on any cocktail card, 
                    and they'll appear here for easy access.
                  </p>
                </div>
              ) : (
                <section className="mt-8 mb-16">
                  <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Your Saved Cocktails</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedCocktails.map((cocktail) => (
                      <CocktailCard 
                        key={cocktail.id} 
                        cocktail={{
                          ...cocktail,
                          matchScore: 0,
                          matchedIngredients: 0,
                          totalIngredients: Array.isArray(cocktail.ingredients) 
                            ? cocktail.ingredients.length 
                            : JSON.parse(cocktail.ingredients as string).length
                        }} 
                      />
                    ))}
                  </div>
                </section>
              )}
            </TabsContent>
            
            <TabsContent value="surprise">
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  Try our Cocktail Game for a surprise recommendation!
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <GameSection />
        <RecipeModal />
      </main>
      
      <Footer />
    </div>
  );
}
