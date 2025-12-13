/**
 * Formatter Helpers
 * 
 * Common utility functions for formatting strings and values.
 * Used across multiple components and pages for consistent formatting.
 */

/**
 * Format label by replacing underscores with spaces and capitalizing words
 * Example: "po_received" -> "Po Received"
 * @param value - String value to format
 * @returns Formatted string or empty string if value is falsy
 */
export const formatLabel = (value: string | null | undefined): string => {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
