import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { CocktailProvider } from "@/context/CocktailContext";
import Home from "@/pages/Home";
import Game from "@/pages/Game";
import Recipes from "@/pages/Recipes";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/game" component={Game} />
      <Route path="/about" component={() => <div>About Page</div>} />
      <Route path="/recipes" component={Recipes} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CocktailProvider>
        <Router />
        <Toaster />
      </CocktailProvider>
    </QueryClientProvider>
  );
}

export default App;
