/**
 * HTML utility functions for handling rich text with links
 */

/**
 * Strips all HTML tags from a string, returning plain text
 * @param html - HTML string to strip tags from
 * @returns Plain text without HTML tags
 */
export const stripHtmlTags = (html: string): string => {
  return html.replace(/<[^>]*>/g, '');
};

/**
 * Link metadata extracted from HTML
 */
export interface LinkMetadata {
  text: string;
  href: string;
  style: string;
  startIndex: number;
  endIndex: number;
}

/**
 * Extracts all link metadata from HTML string
 * @param html - HTML string containing anchor tags
 * @returns Array of link metadata
 */
export const extractLinks = (html: string): LinkMetadata[] => {
  const links: LinkMetadata[] = [];
  const plainText = stripHtmlTags(html);
  let searchIndex = 0;

  // Find all <a> tags
  const regex = /<a\s+([^>]*?)>(.*?)<\/a>/gi;
  let match;

  while ((match = regex.exec(html)) !== null) {
    const attrs = match[1];
    const text = match[2];
    
    // Extract href and style attributes
    const hrefMatch = /href=["']([^"']*)["']/i.exec(attrs);
    const styleMatch = /style=["']([^"']*)["']/i.exec(attrs);
    
    // Find where this link text appears in the plain text
    const startIndex = plainText.indexOf(text, searchIndex);
    
    if (startIndex !== -1) {
      links.push({
        text,
        href: hrefMatch ? hrefMatch[1] : '',
        style: styleMatch ? styleMatch[1] : '',
        startIndex,
        endIndex: startIndex + text.length,
      });
      
      searchIndex = startIndex + text.length;
    }
  }

  return links;
};

/**
 * Reconstructs HTML with links preserved based on plain text changes
 * @param newPlainText - Updated plain text
 * @param originalHtml - Original HTML string with links
 * @returns Reconstructed HTML with links reinserted where possible
 */
export const reconstructHtmlWithLinks = (
  newPlainText: string,
  originalHtml: string
): string => {
  const links = extractLinks(originalHtml);
  
  // If no links, just return plain text
  if (links.length === 0) {
    return newPlainText;
  }

  let result = '';
  let lastIndex = 0;

  links.forEach((link) => {
    // Check if link text still exists in new plain text
    const linkIndexInNew = newPlainText.indexOf(link.text, lastIndex);
    
    if (linkIndexInNew !== -1) {
      // Add text before the link
      result += newPlainText.substring(lastIndex, linkIndexInNew);
      
      // Add the link with preserved attributes
      result += `<a href="${link.href}" style="${link.style}">${link.text}</a>`;
      
      lastIndex = linkIndexInNew + link.text.length;
    }
  });

  // Add remaining text after last link
  result += newPlainText.substring(lastIndex);

  return result;
};
