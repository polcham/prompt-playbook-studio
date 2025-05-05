
import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { File, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import { UsePlaceholdersReturn } from "@/hooks/usePlaceholders";

interface PlaceholderSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (placeholder: string) => void;
  placeholdersHook: UsePlaceholdersReturn;
}

const PlaceholderSelector = ({
  isOpen,
  onOpenChange,
  onSelect,
  placeholdersHook,
}: PlaceholderSelectorProps) => {
  // Add a null check to prevent the destructuring error
  const { placeholders, addPlaceholder } = placeholdersHook || {};
  const [searchTerm, setSearchTerm] = useState("");

  // Filter placeholders based on search term only if placeholders exist
  const filteredPlaceholders = placeholders && searchTerm
    ? placeholders.filter((p) =>
        p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : placeholders || [];

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleAddNewPlaceholder = () => {
    if (!searchTerm || !addPlaceholder) return;
    
    // Create new placeholder if it doesn't exist
    const newPlaceholder = addPlaceholder(searchTerm);
    
    // Select the newly created placeholder
    onSelect(newPlaceholder.label);
    toast.success(`Placeholder [${newPlaceholder.label}] added!`);
    onOpenChange(false);
  };

  // Early return with empty component if placeholdersHook is undefined
  if (!placeholdersHook) {
    console.error("placeholdersHook is undefined in PlaceholderSelector");
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 ${isOpen ? 'block' : 'hidden'}`} onClick={() => onOpenChange(false)} />
      <DialogContent className="sm:max-w-md w-[90%] max-w-[500px] p-0">
        <Command>
          <CommandInput
            placeholder="Search placeholders..."
            value={searchTerm}
            onValueChange={handleSearchChange}
            className="border-none focus:ring-0"
            autoFocus
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>
              <div className="py-3 text-center text-sm">
                <p>No placeholders found.</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mx-auto mt-2 text-primary flex items-center gap-1"
                  onClick={handleAddNewPlaceholder}
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
                  onSelect={() => {
                    onSelect(placeholder.label);
                    onOpenChange(false);
                  }}
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
      </DialogContent>
    </Dialog>
  );
};

export default PlaceholderSelector;
