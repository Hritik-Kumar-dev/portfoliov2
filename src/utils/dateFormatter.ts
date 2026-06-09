/**
 * Format a date string to a readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "January 15, 2024")
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Get reading time in minutes
 * @param text - Text content
 * @returns Reading time in minutes
 */
export const getReadingTime = (text: string): number => {
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
};
