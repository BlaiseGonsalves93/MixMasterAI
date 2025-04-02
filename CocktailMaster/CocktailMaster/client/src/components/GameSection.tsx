import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function GameSection() {
  return (
    <section className="mb-16">
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-center relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cocktail-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 20 L40 20 M20 0 L20 40" stroke="white" strokeWidth="0.5" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cocktail-pattern)" />
          </svg>
        </div>
        
        <div className="relative z-10">
          <h2 className="font-serif text-3xl font-bold mb-3 text-white">Can't Decide? Play Our Cocktail Game!</h2>
          <p className="text-white text-opacity-90 max-w-xl mx-auto mb-8">
            Answer a few fun questions about your mood and preferences, and our AI will suggest the perfect cocktail for your current vibe!
          </p>
          <Link href="/game">
            <Button className="bg-white text-primary-600 font-medium hover:bg-opacity-90 transition shadow-lg">
              Start the Game
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
