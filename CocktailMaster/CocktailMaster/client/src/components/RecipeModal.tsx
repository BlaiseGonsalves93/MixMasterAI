import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { useCocktails } from "@/context/CocktailContext";
import { useMemo } from "react";
import { Heart, Clock, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeModal() {
  const { selectedCocktail, isModalOpen, closeModal, selectedIngredients, isCocktailSaved, toggleSaveCocktail } = useCocktails();

  const ingredients = useMemo(() => {
    if (!selectedCocktail) return [];
    
    const ingredientsList = Array.isArray(selectedCocktail.ingredients) 
      ? selectedCocktail.ingredients 
      : JSON.parse(selectedCocktail.ingredients as string);
      
    const measurementsList = selectedCocktail.measurements 
      ? (Array.isArray(selectedCocktail.measurements) 
          ? selectedCocktail.measurements 
          : JSON.parse(selectedCocktail.measurements as string))
      : [];
    
    return ingredientsList.map((ingredient: string, index: number) => ({
      name: ingredient,
      measure: measurementsList[index] || '',
      available: selectedIngredients.some(
        ing => ingredient.toLowerCase().includes(ing.toLowerCase())
      )
    }));
  }, [selectedCocktail, selectedIngredients]);

  const instructions = useMemo(() => {
    if (!selectedCocktail) return [];
    return selectedCocktail.instructions.split(/\.\s+/).filter(step => step.trim());
  }, [selectedCocktail]);

  if (!selectedCocktail) return null;

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent className="bg-background rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-0">
        <div className="relative">
          <img 
            src={selectedCocktail.imageUrl || `https://source.unsplash.com/1000x600/?cocktail,${encodeURIComponent(selectedCocktail.name)}`} 
            alt={`${selectedCocktail.name} cocktail`} 
            className="w-full h-64 object-cover"
            onError={(e) => {
              e.currentTarget.src = `https://source.unsplash.com/1000x600/?cocktail,${encodeURIComponent(selectedCocktail.name)}`;
            }}
          />
          <DialogClose className="absolute top-4 right-4 bg-background/30 p-2 rounded-full text-white hover:bg-background/50 transition">
            <X className="h-4 w-4" />
          </DialogClose>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 p-6">
            <h2 className="font-serif text-3xl font-bold text-white">{selectedCocktail.name}</h2>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              {selectedCocktail.matchScore !== undefined && selectedCocktail.matchScore > 0 && (
                <span className="bg-primary text-primary-foreground text-sm font-bold px-2.5 py-1 rounded mr-3">
                  {Math.round((selectedCocktail.matchScore || 0) * 100)}% Match
                </span>
              )}
              <div className="flex items-center text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" /> {5 + Math.floor(ingredients.length / 2)} min
              </div>
            </div>
            <Button 
              onClick={() => toggleSaveCocktail(selectedCocktail)}
              variant={isCocktailSaved(selectedCocktail.id) ? "secondary" : "default"}
              className={`py-1.5 rounded-full text-sm ${
                isCocktailSaved(selectedCocktail.id) 
                  ? "bg-background border border-primary text-primary hover:bg-background/90" 
                  : "bg-primary text-white hover:bg-primary/90"
              }`}
            >
              <Heart className="mr-1 h-4 w-4" fill={isCocktailSaved(selectedCocktail.id) ? "currentColor" : "none"} /> 
              {isCocktailSaved(selectedCocktail.id) ? "Saved" : "Save"}
            </Button>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-muted-foreground">
              {selectedCocktail.instructions?.split('.')[0] || `The ${selectedCocktail.name} is a delicious cocktail.`}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Ingredients</h3>
            <ul className="space-y-2">
              {ingredients.map((ingredient: { name: string; measure: string; available: boolean }, idx: number) => (
                <li key={idx} className="flex items-start">
                  <div className={`${
                    ingredient.available 
                      ? "bg-primary/20 text-primary" 
                      : "bg-destructive/10 text-destructive"
                  } p-1 rounded mr-2 mt-0.5`}>
                    {ingredient.available ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                  </div>
                  <span className={`${ingredient.available ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
                    {ingredient.measure ? `${ingredient.measure} ` : ""}
                    <span className={`${ingredient.available ? "text-foreground" : "text-foreground/60"} font-medium`}>
                      {ingredient.name}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Instructions</h3>
            <ol className="space-y-3">
              {instructions.map((step: string, idx: number) => (
                <li key={idx} className="flex">
                  <span className="bg-muted h-6 w-6 rounded-full flex items-center justify-center text-sm font-medium mr-3 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-muted-foreground">{step}.</p>
                </li>
              ))}
            </ol>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2">Similar Cocktails</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Daiquiri', img: 'https://source.unsplash.com/300x150/?cocktail,daiquiri' },
                { name: 'Caipirinha', img: 'https://source.unsplash.com/300x150/?cocktail,caipirinha' },
                { name: 'Mint Julep', img: 'https://source.unsplash.com/300x150/?cocktail,mint,julep' }
              ].map((cocktail: { name: string; img: string }, idx: number) => (
                <div key={idx} className="bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition">
                  <img 
                    src={cocktail.img}
                    alt={`${cocktail.name} cocktail`} 
                    className="w-full h-20 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = `https://source.unsplash.com/300x150/?cocktail,${encodeURIComponent(cocktail.name)}`;
                    }}
                  />
                  <div className="p-2 text-center">
                    <p className="text-sm font-medium">{cocktail.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
