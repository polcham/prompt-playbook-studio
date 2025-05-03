
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="border-b py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">PromptPlaybook</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="font-medium text-sm hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/library" className="font-medium text-sm hover:text-primary transition-colors">
            Browse Prompts
          </Link>
          <Link to="/submit" className="font-medium text-sm hover:text-primary transition-colors">
            Submit a Prompt
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </Button>
          <Button size="sm">Sign Up</Button>
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="space-y-2">
            <span className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></span>
            <span className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 px-4 bg-background shadow-lg animate-fade-in">
          <nav className="flex flex-col gap-4">
            <Link 
              to="/" 
              className="font-medium text-base hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/library" 
              className="font-medium text-base hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Prompts
            </Link>
            <Link 
              to="/submit" 
              className="font-medium text-base hover:text-primary transition-colors py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Submit a Prompt
            </Link>
            <div className="pt-4 border-t mt-2">
              <Button className="w-full mb-3">Sign Up</Button>
              <Button variant="outline" className="w-full gap-2">
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
