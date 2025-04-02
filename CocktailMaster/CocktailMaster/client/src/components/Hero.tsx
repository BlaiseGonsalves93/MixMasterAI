import { Button } from "@/components/ui/button";
import { Wand2, Dice5 } from "lucide-react";
import { Link } from "wouter";
import { useCocktails } from "@/context/CocktailContext";

export default function Hero() {
  const { getRecommendationsForIngredients } = useCocktails();

  return (
    <section className="mb-12 text-center">
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
        Find Your Perfect Cocktail
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
        Our AI-powered system recommends the best cocktails based on ingredients you have. Let's mix something amazing!
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition shadow-lg"
          onClick={() => {
            const section = document.getElementById('ingredient-selector');
            if (section) {
              section.scrollIntoView({ behavior: 'smooth' });
            }
          }}
        >
          <Wand2 className="mr-2 h-5 w-5" /> Get Recommendations
        </Button>
        <Link href="/game">
          <Button 
            variant="outline" 
            size="lg" 
            className="hover:bg-muted/80 transition border border-border"
          >
            <Dice5 className="mr-2 h-5 w-5" /> Try Our Game
          </Button>
        </Link>
      </div>
    </section>
  );
}
