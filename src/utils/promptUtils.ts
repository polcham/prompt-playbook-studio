
/**
 * Extract placeholders from a prompt content string
 * Placeholders are defined as text inside square brackets []
 */
export const extractPlaceholders = (content: string): string[] => {
  const placeholderRegex = /\[([^\]]+)\]/g;
  const matches = content.match(placeholderRegex);
  
  if (!matches) return [];
  
  // Remove the brackets and return unique placeholders
  return [...new Set(matches.map(match => match.replace(/[\[\]]/g, '')))];
};

/**
 * Format a list of placeholders into a readable string
 */
export const formatPlaceholders = (placeholders: string[]): string => {
  if (!placeholders || placeholders.length === 0) {
    return "No placeholders found";
  }
  
  return placeholders.join(", ");
};

/**
 * Generate a description for a new placeholder
 * @param placeholder The placeholder name
 * @returns An AI-generated description
 */
export const generatePlaceholderDescription = (placeholder: string): string => {
  // Map of common placeholder descriptions
  const commonDescriptions: Record<string, string> = {
    "TOPIC": "Main subject of the prompt",
    "AUDIENCE": "Target audience",
    "TONE": "Tone of voice (formal, casual, etc)",
    "LENGTH": "Expected output length",
    "FORMAT": "Output format (blog, email, etc)",
    "KEYWORDS": "Important keywords to include",
    "STYLE": "Writing style",
    "GOAL": "Goal of the content",
    "EXAMPLE": "Example to follow",
    "CONTEXT": "Background information",
  };

  // Check if we have a predefined description
  if (placeholder.toUpperCase() in commonDescriptions) {
    return commonDescriptions[placeholder.toUpperCase()];
  }

  // Generate a description based on the placeholder name
  const words = placeholder.split(/(?=[A-Z])/).join(' ').toLowerCase().split(' ');
  const capitalizedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1));
  
  return `${capitalizedWords.join(' ')} to include in the prompt`;
};

/**
 * Placeholder interface
 */
export interface Placeholder {
  id: string;
  label: string;
  description: string;
}

/**
 * Create a new placeholder object
 */
export const createPlaceholder = (label: string): Placeholder => {
  return {
    id: label.toLowerCase(),
    label: label.toUpperCase(),
    description: generatePlaceholderDescription(label),
  };
};
