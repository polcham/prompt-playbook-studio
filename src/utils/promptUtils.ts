
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
