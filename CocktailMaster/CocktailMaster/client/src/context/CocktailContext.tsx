import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getIngredients, getRecommendations } from "@/lib/cocktailApi";
import { Ingredient, Cocktail, CocktailWithMatchData, SortOption, ActiveTab } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface CocktailContextType {
  // Ingredients
  allIngredients: Ingredient[];
  isLoadingIngredients: boolean;
  selectedIngredients: string[];
  selectIngredient: (ingredient: string) => void;
  removeIngredient: (ingredient: string) => void;
  
  // Recommendations
  recommendations: CocktailWithMatchData[];
  isLoadingRecommendations: boolean;
  getRecommendationsForIngredients: () => Promise<void>;
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  sortedRecommendations: CocktailWithMatchData[];
  
  // Selected cocktail and modal
  selectedCocktail: Cocktail | null;
  isModalOpen: boolean;
  openModal: (cocktail: Cocktail) => void;
  closeModal: () => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Tabs
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  
  // Saved cocktails
  savedCocktails: Cocktail[];
  isCocktailSaved: (cocktailId: number) => boolean;
  toggleSaveCocktail: (cocktail: Cocktail) => void;
}

const CocktailContext = createContext<CocktailContextType | undefined>(undefined);

export function CocktailProvider({ children }: { children: ReactNode }) {
  // Ingredients state
  const [allIngredients, setAllIngredients] = useState<Ingredient[]>([]);
  const [isLoadingIngredients, setIsLoadingIngredients] = useState(true);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<CocktailWithMatchData[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>("relevance");
  
  // Modal state
  const [selectedCocktail, setSelectedCocktail] = useState<Cocktail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>("ingredients");
  
  // Saved cocktails state with local storage persistence
  const [savedCocktails, setSavedCocktails] = useState<Cocktail[]>(() => {
    const saved = localStorage.getItem('savedCocktails');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Toast notifications
  const { toast } = useToast();
  
  // Persist saved cocktails to localStorage
  useEffect(() => {
    localStorage.setItem('savedCocktails', JSON.stringify(savedCocktails));
  }, [savedCocktails]);
  
  // Fetch ingredients on mount
  useEffect(() => {
    async function loadIngredients() {
      try {
        const ingredients = await getIngredients();
        setAllIngredients(ingredients);
      } catch (error) {
        console.error("Failed to load ingredients:", error);
        toast({
          title: "Error",
          description: "Failed to load ingredients. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingIngredients(false);
      }
    }
    
    loadIngredients();
  }, [toast]);
  
  // Handle ingredient selection
  const selectIngredient = (ingredient: string) => {
    if (!selectedIngredients.includes(ingredient)) {
      setSelectedIngredients([...selectedIngredients, ingredient]);
    }
  };
  
  // Handle ingredient removal
  const removeIngredient = (ingredient: string) => {
    setSelectedIngredients(selectedIngredients.filter(i => i !== ingredient));
  };
  
  // Get recommendations based on selected ingredients
  const getRecommendationsForIngredients = async () => {
    if (selectedIngredients.length === 0) {
      toast({
        title: "No ingredients selected",
        description: "Please select at least one ingredient to get recommendations.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoadingRecommendations(true);
    
    try {
      const results = await getRecommendations(selectedIngredients);
      setRecommendations(results);
      
      // Reset the selected ingredients after getting recommendations
      setSelectedIngredients([]);
      
      toast({
        title: "Ingredients Reset",
        description: "Selected ingredients have been reset for your next search.",
      });
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({
        title: "Error",
        description: "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  // Open cocktail modal
  const openModal = (cocktail: Cocktail) => {
    setSelectedCocktail(cocktail);
    setIsModalOpen(true);
  };
  
  // Close cocktail modal
  const closeModal = () => {
    setIsModalOpen(false);
  };
  
  // Check if a cocktail is saved
  const isCocktailSaved = (cocktailId: number): boolean => {
    return savedCocktails.some(cocktail => cocktail.id === cocktailId);
  };
  
  // Toggle save status of a cocktail
  const toggleSaveCocktail = (cocktail: Cocktail) => {
    if (isCocktailSaved(cocktail.id)) {
      // If already saved, remove it
      setSavedCocktails(savedCocktails.filter(c => c.id !== cocktail.id));
      toast({
        title: "Removed from favorites",
        description: `${cocktail.name} has been removed from your favorites.`,
      });
    } else {
      // If not saved, add it
      setSavedCocktails([...savedCocktails, cocktail]);
      toast({
        title: "Added to favorites",
        description: `${cocktail.name} has been added to your favorites.`,
      });
    }
  };
  
  // Sort recommendations based on selected sort option
  const sortedRecommendations = [...recommendations].sort((a, b) => {
    switch (sortOption) {
      case "relevance":
        return b.matchScore - a.matchScore;
      case "popularity":
        // We don't have popularity data, so we'll just use ID as a proxy (lower ID = more popular)
        return a.id - b.id;
      case "easiest":
        return a.totalIngredients - b.totalIngredients;
      default:
        return 0;
    }
  });
  
  // Provide context value
  const value = {
    allIngredients,
    isLoadingIngredients,
    selectedIngredients,
    selectIngredient,
    removeIngredient,
    
    recommendations,
    isLoadingRecommendations,
    getRecommendationsForIngredients,
    sortOption,
    setSortOption,
    sortedRecommendations,
    
    selectedCocktail,
    isModalOpen,
    openModal,
    closeModal,
    
    searchQuery,
    setSearchQuery,
    
    activeTab,
    setActiveTab,
    
    savedCocktails,
    isCocktailSaved,
    toggleSaveCocktail,
  };
  
  return (
    <CocktailContext.Provider value={value}>
      {children}
    </CocktailContext.Provider>
  );
}

export function useCocktails() {
  const context = useContext(CocktailContext);
  if (!context) {
    throw new Error("useCocktails must be used within a CocktailProvider");
  }
  return context;
}
