import { Wine, Instagram, Twitter, Facebook, Dribbble } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-muted/30 py-8 px-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <a className="flex items-center">
                <Wine className="h-5 w-5 text-amber-400" />
                <h2 className="font-serif text-xl font-bold ml-2 text-white">
                  MixMaster<span className="text-amber-400">AI</span>
                </h2>
              </a>
            </Link>
            <p className="text-muted-foreground text-sm mt-2">AI-powered cocktail recommendations</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-medium text-white mb-3 uppercase">Features</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition">Recommendations</a></li>
                <li><a href="#" className="hover:text-primary transition">Cocktail Game</a></li>
                <li><a href="#" className="hover:text-primary transition">Recipe Library</a></li>
                <li><a href="#" className="hover:text-primary transition">Ingredient Guide</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-3 uppercase">Company</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition">Partners</a></li>
                <li><a href="#" className="hover:text-primary transition">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-white mb-3 uppercase">Legal</h3>
              <ul className="text-muted-foreground space-y-2 text-sm">
                <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">© 2023 MixMasterAI. All rights reserved.</p>
          
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition">
              <Dribbble className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
