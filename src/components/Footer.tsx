
import { Link } from 'react-router-dom';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  return <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-md bg-gradient-to-r from-brand-purple to-brand-pink flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <span className="font-display font-bold text-xl">PromptBook</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your go-to library for AI prompt templates. Find, copy, remix, and share prompts for any task.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link to="/library" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Browse All</Link></li>
              <li><Link to="/library?category=writing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Writing Prompts</Link></li>
              <li><Link to="/library?category=design" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Design Prompts</Link></li>
              <li><Link to="/library?category=coding" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Coding Prompts</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">AI Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/library?tool=chatgpt" className="text-sm text-muted-foreground hover:text-foreground transition-colors">ChatGPT</Link></li>
              <li><Link to="/library?tool=midjourney" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Midjourney</Link></li>
              <li><Link to="/library?tool=claude" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Claude</Link></li>
              <li><Link to="/library?tool=dall-e" className="text-sm text-muted-foreground hover:text-foreground transition-colors">DALL-E</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Use</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {currentYear} PromptBook. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">GitHub</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Discord</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-square-plus"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path><line x1="9" x2="15" y1="10" y2="10"></line><line x1="12" x2="12" y1="7" y2="13"></line></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;
