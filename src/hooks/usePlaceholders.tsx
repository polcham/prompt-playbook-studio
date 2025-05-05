
import { useState, useCallback } from "react";
import { Placeholder, createPlaceholder } from "@/utils/promptUtils";

// Initial placeholders list
const initialPlaceholders: Placeholder[] = [
  { id: "topic", label: "TOPIC", description: "Main subject of the prompt" },
  { id: "audience", label: "AUDIENCE", description: "Target audience" },
  { id: "tone", label: "TONE", description: "Tone of voice (formal, casual, etc)" },
  { id: "length", label: "LENGTH", description: "Expected output length" },
  { id: "format", label: "FORMAT", description: "Output format (blog, email, etc)" },
  { id: "keywords", label: "KEYWORDS", description: "Important keywords to include" },
  { id: "style", label: "STYLE", description: "Writing style" },
  { id: "goal", label: "GOAL", description: "Goal of the content" },
  { id: "example", label: "EXAMPLE", description: "Example to follow" },
  { id: "context", label: "CONTEXT", description: "Background information" },
];

export interface UsePlaceholdersReturn {
  placeholders: Placeholder[];
  addPlaceholder: (label: string) => Placeholder;
  removePlaceholder: (id: string) => void;
  getPlaceholderByLabel: (label: string) => Placeholder | undefined;
  resetPlaceholders: () => void;
}

/**
 * Hook to manage placeholder state and operations
 */
export const usePlaceholders = (): UsePlaceholdersReturn => {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(initialPlaceholders);
  
  /**
   * Add a new placeholder if it doesn't already exist
   */
  const addPlaceholder = useCallback((label: string): Placeholder => {
    // Check if placeholder already exists (case insensitive)
    const existingPlaceholder = placeholders.find(
      p => p.label.toLowerCase() === label.toLowerCase()
    );
    
    if (existingPlaceholder) {
      return existingPlaceholder;
    }
    
    // Create and add new placeholder
    const newPlaceholder = createPlaceholder(label);
    setPlaceholders(prev => [...prev, newPlaceholder]);
    return newPlaceholder;
  }, [placeholders]);
  
  /**
   * Remove a placeholder by ID
   */
  const removePlaceholder = useCallback((id: string): void => {
    setPlaceholders(prev => prev.filter(p => p.id !== id));
  }, []);
  
  /**
   * Find placeholder by label (case insensitive)
   */
  const getPlaceholderByLabel = useCallback((label: string): Placeholder | undefined => {
    return placeholders.find(p => p.label.toLowerCase() === label.toLowerCase());
  }, [placeholders]);
  
  /**
   * Reset placeholders to initial state
   */
  const resetPlaceholders = useCallback((): void => {
    setPlaceholders(initialPlaceholders);
  }, []);
  
  return {
    placeholders,
    addPlaceholder,
    removePlaceholder,
    getPlaceholderByLabel,
    resetPlaceholders
  };
};
