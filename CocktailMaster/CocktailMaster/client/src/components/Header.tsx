import { Link, useLocation } from "wouter";
import { Wine } from "lucide-react";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="bg-gradient-to-r from-primary/90 to-primary py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="flex items-center">
            <Wine className="h-6 w-6 text-amber-400" />
            <h1 className="font-serif text-2xl md:text-3xl font-bold ml-2 text-white">
              MixMaster<span className="text-amber-400">AI</span>
            </h1>
          </a>
        </Link>
        <nav>
          <ul className="flex space-x-6 text-sm md:text-base font-medium">
            <li className="hidden md:block">
              <Link href="/">
                <a className={`text-white hover:text-amber-400 transition ${location === "/" ? "text-amber-400" : ""}`}>
                  Home
                </a>
              </Link>
            </li>
            <li className="hidden md:block">
              <Link href="/recipes">
                <a className={`text-white hover:text-amber-400 transition ${location === "/recipes" ? "text-amber-400" : ""}`}>
                  Recipes
                </a>
              </Link>
            </li>
            <li>
              <Link href="/game">
                <a className={`text-white hover:text-amber-400 transition ${location === "/game" ? "text-amber-400" : ""}`}>
                  Game
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className={`text-white hover:text-amber-400 transition ${location === "/about" ? "text-amber-400" : ""}`}>
                  About
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
