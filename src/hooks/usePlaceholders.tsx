
import { useState } from "react";
import { Placeholder } from "@/utils/promptUtils";

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

export const usePlaceholders = () => {
  const [placeholders, setPlaceholders] = useState<Placeholder[]>(initialPlaceholders);
  
  return {
    placeholders,
    setPlaceholders
  };
};
