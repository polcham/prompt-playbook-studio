
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { File, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { Placeholder, createPlaceholder } from "@/utils/promptUtils";

interface PlaceholderSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (placeholder: string) => void;
  cursorCoords: { top: number; left: number };
  placeholders: Placeholder[];
  setPlaceholders: React.Dispatch<React.SetStateAction<Placeholder[]>>;
}

const PlaceholderSelector = ({
  isOpen,
  onOpenChange,
  onSelect,
  cursorCoords,
  placeholders,
  setPlaceholders,
}: PlaceholderSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter placeholders based on search term
  const filteredPlaceholders = searchTerm
    ? placeholders.filter((p) =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : placeholders;

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const addNewPlaceholder = () => {
    if (!searchTerm) return;
    
    // Check if placeholder already exists (case insensitive)
    const exists = placeholders.some(p => 
      p.label.toLowerCase() === searchTerm.toLowerCase()
    );
    
    if (!exists) {
      const newPlaceholder = createPlaceholder(searchTerm);
      setPlaceholders(prev => [...prev, newPlaceholder]);
      
      // Select the newly created placeholder
      onSelect(newPlaceholder.label);
      toast.success(`New placeholder [${newPlaceholder.label}] created!`);
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <PopoverContent
        className="w-[300px] p-0"
        align="start"
        style={{
          position: 'absolute',
          top: `${cursorCoords.top}px`,
          left: `${cursorCoords.left}px`,
          transform: 'translateY(20px)'
        }}
        onEscapeKeyDown={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
      >
        <Command>
          <CommandInput
            placeholder="Search placeholders..."
            value={searchTerm}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            <CommandEmpty>
              <div className="py-3 text-center text-sm">
                <p>No placeholders found.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mx-auto mt-2 text-primary flex items-center gap-1"
                  onClick={addNewPlaceholder}
                >
                  <PlusCircle className="h-4 w-4" />
                  Create "{searchTerm.toUpperCase()}"
                </Button>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredPlaceholders.map((placeholder) => (
                <CommandItem
                  key={placeholder.id}
                  onSelect={() => onSelect(placeholder.label)}
                >
                  <File className="mr-2 h-4 w-4" />
                  <div>
                    <p className="font-medium">{placeholder.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {placeholder.description}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default PlaceholderSelector;
