import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Moon, Sun, LogIn, BookMarked, LogOut } from "lucide-react";
import { useDarkMode } from "@/contexts/DarkModeContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b py-4" role="banner">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-2"
            aria-label="PromptBook Home"
          >
            <div className="w-10 h-10 rounded-md bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">
              PromptBook
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <nav
          className="hidden md:flex items-center gap-6"
          aria-label="Main Navigation"
        >
          <Link
            to="/"
            className={`font-medium text-sm hover:text-primary transition-colors ${
              location.pathname === "/" ? "text-primary" : ""
            }`}
          >
            Home
          </Link>
          <Link
            to="/library"
            className={`font-medium text-sm hover:text-primary transition-colors ${
              location.pathname === "/library" ? "text-primary" : ""
            }`}
          >
            Browse Prompts
          </Link>
          <Link
            to="/submit"
            className={`font-medium text-sm hover:text-primary transition-colors ${
              location.pathname === "/submit" ? "text-primary" : ""
            }`}
          >
            Submit a Prompt
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={
              isDarkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          {/* <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label="Submit a prompt"
          >
            <Link to="/submit">
              <Pencil className="h-4 w-4" />
              <span>Submit Prompt</span>
            </Link>
          </Button> */}
          {isLoggedIn ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/favorites" className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  Saved
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link to="/login" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Toggle mobile menu"
        >
          <div className="space-y-2">
            <span
              className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2.5" : ""
              }`}
            ></span>
            <span
              className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></span>
            <span
              className={`block w-8 h-0.5 bg-foreground transition-all duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2.5" : ""
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden py-4 px-4 bg-background shadow-lg animate-fade-in absolute w-full z-50"
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <nav className="flex flex-col gap-4">
            <Link
              to="/"
              className={`font-medium text-base hover:text-primary transition-colors py-2 ${
                location.pathname === "/" ? "text-primary" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/library"
              className={`font-medium text-base hover:text-primary transition-colors py-2 ${
                location.pathname === "/library" ? "text-primary" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Prompts
            </Link>
            <Link
              to="/submit"
              className={`font-medium text-base hover:text-primary transition-colors py-2 ${
                location.pathname === "/submit" ? "text-primary" : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Submit a Prompt
            </Link>
            {isLoggedIn && (
              <Link
                to="/favorites"
                className={`font-medium text-base hover:text-primary transition-colors py-2 ${
                  location.pathname === "/favorites" ? "text-primary" : ""
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Saved
              </Link>
            )}
            <div className="flex items-center gap-4 pt-4 border-t mt-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  toggleDarkMode();
                  setIsMobileMenuOpen(false);
                }}
                aria-label={
                  isDarkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div>
              {isLoggedIn ? (
                <>
                  <Button
                    variant="outline"
                    className="w-full mb-3 flex items-center justify-center gap-2"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button className="w-full mb-3" asChild>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    Sign In
                  </Link>
                </Button>
              )}
              {/* <Button
                variant="outline"
                className="w-full gap-2"
                aria-label="Search prompts"
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Button> */}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
