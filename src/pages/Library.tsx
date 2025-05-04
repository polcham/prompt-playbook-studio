
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import CategorySidebar from "@/components/CategorySidebar";
import TagFilter from "@/components/TagFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prompt, getPromptsByCategory, getPromptsByTool, samplePrompts } from "@/data/prompts";

const Library = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category") || "all";
  const toolParam = searchParams.get("tool") || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTool, setSelectedTool] = useState(toolParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);

  // Extract all unique tags from prompts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    samplePrompts.forEach(prompt => {
      prompt.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [selectedCategory, selectedTool, searchQuery, selectedTags]);

  const filterPrompts = () => {
    let filtered = [...samplePrompts];

    if (selectedCategory !== "all") {
      filtered = filtered.filter((prompt) => prompt.category === selectedCategory);
    }

    if (selectedTool !== "all") {
      filtered = filtered.filter((prompt) => prompt.tool === selectedTool);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((prompt) => 
        selectedTags.some(tag => prompt.tags.includes(tag))
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(query) ||
          prompt.description.toLowerCase().includes(query) ||
          prompt.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredPrompts(filtered);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Prompt Library</h1>
            <p className="text-muted-foreground">
              Browse our collection of AI prompt templates for various tools and use cases.
            </p>
          </div>

          <div className="mb-8">
            <div className="flex gap-3">
              <Input
                type="search"
                placeholder="Search prompts..."
                className="max-w-md"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Button variant="outline">Search</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <CategorySidebar
                selectedCategory={selectedCategory}
                selectedTool={selectedTool}
                onCategoryChange={handleCategoryChange}
                onToolChange={handleToolChange}
              />
              
              <div className="mt-8">
                <TagFilter 
                  tags={allTags}
                  selectedTags={selectedTags}
                  onTagSelect={handleTagSelect}
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              {filteredPrompts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPrompts.map((prompt) => (
                    <PromptCard key={prompt.id} prompt={prompt} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-2">No prompts found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Library;
