
import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tag as TagIcon } from "lucide-react";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

const TagFilter = ({ tags, selectedTags, onTagSelect }: TagFilterProps) => {
  const [showAllTags, setShowAllTags] = useState(false);
  
  // Show top 10 tags by default, or all if showAllTags is true
  const displayTags = showAllTags ? tags : tags.slice(0, 10);
  
  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <TagIcon className="h-4 w-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">Filter by Tags</h3>
      </div>
      
      <ScrollArea className="h-auto max-h-[180px]">
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
      </ScrollArea>
      
      {tags.length > 10 && (
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
