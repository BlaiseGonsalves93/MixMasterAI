import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RecipeModal from "@/components/RecipeModal";
import { Sun, Wind, Flame, Wine, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useCocktails } from "@/context/CocktailContext";
import { getGameRecommendation } from "@/lib/cocktailApi";
import { useToast } from "@/hooks/use-toast";
import { GameMood } from "@/lib/types";

export default function Game() {
  const [location, setLocation] = useLocation();
  const { openModal } = useCocktails();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<GameMood | null>(null);
  const [strength, setStrength] = useState<string | null>(null);
  const [sweet, setSweet] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  
  const totalSteps = 3;
  const progress = Math.round((step / totalSteps) * 100);
  
  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleGetRecommendation();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      setLocation("/");
    }
  };
  
  const handleGetRecommendation = async () => {
    if (!mood) {
      toast({
        title: "Please select your mood",
        description: "We need to know how you're feeling to recommend a drink",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const cocktail = await getGameRecommendation(mood);
      openModal(cocktail);
    } catch (error) {
      console.error("Failed to get game recommendation:", error);
      toast({
        title: "Error",
        description: "Failed to get cocktail recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto bg-muted/30 rounded-xl p-8 relative">
          <button 
            onClick={() => setLocation("/")}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center mb-8">
            <h2 className="font-serif text-3xl font-bold mb-2">The Cocktail Mood Game</h2>
            <p className="text-muted-foreground">Tell us how you're feeling and we'll find your perfect match!</p>
          </div>
          
          <CardContent className="px-0">
            {/* Step 1: Mood */}
            {step === 1 && (
              <div className="game-step">
                <h3 className="text-xl font-medium mb-6">What's your mood right now?</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <Button
                    variant={mood === "cheerful" ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center ${
                      mood === "cheerful" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setMood("cheerful")}
                  >
                    <Sun className="h-8 w-8 mb-2 text-amber-400" />
                    <span className="font-medium">Cheerful</span>
                  </Button>
                  <Button
                    variant={mood === "relaxed" ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center ${
                      mood === "relaxed" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setMood("relaxed")}
                  >
                    <Wind className="h-8 w-8 mb-2 text-amber-400" />
                    <span className="font-medium">Relaxed</span>
                  </Button>
                  <Button
                    variant={mood === "adventurous" ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center ${
                      mood === "adventurous" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setMood("adventurous")}
                  >
                    <Flame className="h-8 w-8 mb-2 text-amber-400" />
                    <span className="font-medium">Adventurous</span>
                  </Button>
                  <Button
                    variant={mood === "sophisticated" ? "default" : "outline"}
                    className={`p-4 h-auto flex flex-col items-center ${
                      mood === "sophisticated" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setMood("sophisticated")}
                  >
                    <Wine className="h-8 w-8 mb-2 text-amber-400" />
                    <span className="font-medium">Sophisticated</span>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 2: Strength */}
            {step === 2 && (
              <div className="game-step">
                <h3 className="text-xl font-medium mb-6">How strong do you like your drinks?</h3>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <Button
                    variant={strength === "light" ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      strength === "light" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setStrength("light")}
                  >
                    Light
                  </Button>
                  <Button
                    variant={strength === "medium" ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      strength === "medium" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setStrength("medium")}
                  >
                    Medium
                  </Button>
                  <Button
                    variant={strength === "strong" ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      strength === "strong" ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setStrength("strong")}
                  >
                    Strong
                  </Button>
                </div>
              </div>
            )}
            
            {/* Step 3: Sweet or Not */}
            {step === 3 && (
              <div className="game-step">
                <h3 className="text-xl font-medium mb-6">Do you prefer sweet or not-so-sweet drinks?</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <Button
                    variant={sweet === true ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      sweet === true ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setSweet(true)}
                  >
                    Sweet
                  </Button>
                  <Button
                    variant={sweet === false ? "default" : "outline"}
                    className={`p-4 h-auto ${
                      sweet === false ? "bg-primary" : "bg-muted hover:bg-primary/20"
                    }`}
                    onClick={() => setSweet(false)}
                  >
                    Not Sweet
                  </Button>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="mr-1 h-4 w-4" /> Back
              </Button>
              <Button 
                onClick={handleNext}
                disabled={
                  (step === 1 && !mood) || 
                  (step === 2 && !strength) || 
                  (step === 3 && sweet === null) ||
                  loading
                }
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition"
              >
                {step === totalSteps ? (
                  loading ? "Finding your cocktail..." : "Get My Cocktail"
                ) : (
                  <>Next <ArrowRight className="ml-1 h-4 w-4" /></>
                )}
              </Button>
            </div>
          </CardContent>
          
          {/* Game Progress */}
          <div className="mt-8">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Step {step} of {totalSteps}</span>
              <span>{progress}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </Card>
      </main>
      
      <Footer />
      <RecipeModal />
    </div>
  );
}
