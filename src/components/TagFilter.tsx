
import { useState, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Tag as TagIcon, Search } from "lucide-react";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ tags, selectedTags, onTagSelect }: TagFilterProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  const [tagSearchQuery, setTagSearchQuery] = useState('');
  
  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    return tags.filter(tag => 
      tag.toLowerCase().includes(tagSearchQuery.toLowerCase())
    );
  }, [tags, tagSearchQuery]);
  
  // Show top 10 tags by default, or all if showAllTags is true or if there's a search query
  const displayTags = useMemo(() => {
    if (tagSearchQuery) return filteredTags;
    return showAllTags ? filteredTags : filteredTags.slice(0, 10);
  }, [filteredTags, showAllTags, tagSearchQuery]);
  
  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter by Tags</h3>
      </div>
      
      <div className="mb-3 relative">
        <Input
          placeholder="Search tags..."
          value={tagSearchQuery}
          onChange={(e) => setTagSearchQuery(e.target.value)}
          className="pl-8"
        />
        <Search className="h-4 w-4 text-muted-foreground absolute left-2 top-3" />
      </div>
      
      <ScrollArea className="h-auto max-h-[180px]">
        {displayTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className={`cursor-pointer hover:bg-secondary ${
                  selectedTags.includes(tag) ? "" : "hover:text-foreground"
                }`}
                onClick={() => onTagSelect(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-sm py-2">
            No tags found matching your search
          </div>
        )}
      </ScrollArea>
      
      {!tagSearchQuery && filteredTags.length > 10 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mt-2 text-xs"
          onClick={toggleShowAllTags}
        >
          {showAllTags ? "Show less tags" : "Show all tags"}
        </Button>
      )}
    </div>
  );
};

export default TagFilter;
