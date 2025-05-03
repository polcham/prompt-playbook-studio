
import { useState } from "react";
import { promptCategories, promptTools } from "@/data/prompts";
import { Button } from "@/components/ui/button";

interface CategorySidebarProps {
  selectedCategory: string;
  selectedTool: string;
  onCategoryChange: (category: string) => void;
  onToolChange: (tool: string) => void;
}

const CategorySidebar = ({
  selectedCategory,
  selectedTool,
  onCategoryChange,
  onToolChange,
}: CategorySidebarProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <div className="md:hidden mb-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-between"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <span>Filters</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}
          >
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </Button>
      </div>

      <div className={`md:block ${isFilterOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-sm mb-3">Categories</h3>
            <ul className="space-y-1">
              {promptCategories.map((category) => (
                <li key={category.id}>
                  <button
                    className={`w-full text-left py-2 px-3 text-sm rounded-md transition-colors ${
                      selectedCategory === category.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      onCategoryChange(category.id);
                      setIsFilterOpen(false);
                    }}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">AI Tools</h3>
            <ul className="space-y-1">
              {promptTools.map((tool) => (
                <li key={tool.id}>
                  <button
                    className={`w-full text-left py-2 px-3 text-sm rounded-md transition-colors ${
                      selectedTool === tool.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                    onClick={() => {
                      onToolChange(tool.id);
                      setIsFilterOpen(false);
                    }}
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategorySidebar;
