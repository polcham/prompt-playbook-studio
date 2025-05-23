
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromptCard from "@/components/PromptCard";
import CategorySidebar from "@/components/CategorySidebar";
import TagFilter from "@/components/TagFilter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Prompt } from "@/data/prompts";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const Library = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get("category") || "all";
  const toolParam = searchParams.get("tool") || "all";

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedTool, setSelectedTool] = useState(toolParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Fetch prompts from Supabase
  const { data: promptsData, isLoading } = useQuery({
    queryKey: ['prompts', selectedCategory, selectedTool, selectedTags, searchQuery, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (selectedTool !== "all") {
        query = query.eq('tool', selectedTool);
      }

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      if (searchQuery.trim() !== "") {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      // Add pagination
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching prompts:', error);
        throw error;
      }

      // Transform the data to match our Prompt interface
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        content: item.content,
        tool: item.tool as 'chatgpt' | 'midjourney' | 'claude' | 'dall-e' | 'other',
        category: item.category,
        tags: item.tags,
        authorName: item.author_name, // Map from snake_case to camelCase
        createdAt: item.created_at,   // Map from snake_case to camelCase
        likes: 0,                     // Default value since we don't have this in DB yet
      })) as Prompt[];
    },
  });

  // Count total prompts for pagination
  const { data: countData } = useQuery({
    queryKey: ['promptsCount', selectedCategory, selectedTool, selectedTags, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from('prompts')
        .select('id', { count: 'exact' })
        .eq('is_approved', true);

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      if (selectedTool !== "all") {
        query = query.eq('tool', selectedTool);
      }

      if (selectedTags.length > 0) {
        query = query.contains('tags', selectedTags);
      }

      if (searchQuery.trim() !== "") {
        query = query.or(
          `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
        );
      }

      const { count, error } = await query;

      if (error) {
        console.error('Error counting prompts:', error);
        throw error;
      }

      return count || 0;
    },
  });

  // Extract all unique tags from prompts
  const { data: allTags } = useQuery({
    queryKey: ['promptTags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('prompts')
        .select('tags')
        .eq('is_approved', true);

      if (error) {
        console.error('Error fetching tags:', error);
        throw error;
      }

      const tagSet = new Set<string>();
      data.forEach(prompt => {
        prompt.tags.forEach((tag: string) => tagSet.add(tag));
      });
      
      return Array.from(tagSet).sort();
    },
  });

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
    setCurrentPage(1);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
                  tags={allTags || []}
                  selectedTags={selectedTags}
                  onTagSelect={handleTagSelect}
                />
              </div>
            </div>
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading prompts...</p>
                </div>
              ) : promptsData && promptsData.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {promptsData.map((prompt) => (
                      <PromptCard key={prompt.id} prompt={prompt} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination className="mt-8">
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) handlePageChange(currentPage - 1);
                            }}
                            aria-disabled={currentPage === 1}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          const pageNum = i + 1;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink 
                                href="#" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNum);
                                }}
                                isActive={currentPage === pageNum}
                              >
                                {pageNum}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) handlePageChange(currentPage + 1);
                            }}
                            aria-disabled={currentPage === totalPages}
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </>
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
