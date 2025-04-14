import { chatAPI, initializeAPI } from '../../services/api/chat';

// Re-export API functions
export const { sendMessage: sendMessageAPI } = chatAPI;
export { initializeAPI };

// Types
export interface Message {
  id: number | string;
  content: string;
  sender: 'user' | 'ai';
  timestamp?: string;
  content_type?: 'text' | 'text_image';
  agent?: string;
  conversation_id?: string;
  image_url?: string;
}

export interface CurrentChat {
  user: Message | null;
  ai: Message | null;
}

// Utility function to parse message content (similar to Laravel example)
export const parseMessage = (content: string | undefined | null): string => {
  if (!content) return '';

  let parsedContent = content;

  // Remove ### headers after double line breaks since they're already on a new line
  parsedContent = parsedContent.replace(/\n\n###\s/g, '\n\n');

  // Convert double line breaks
  parsedContent = parsedContent.replace(/\n\n/g, '<br><br>');

  // Convert single line breaks (not preceded by another line break)
  parsedContent = parsedContent.replace(/\n(?!\n)/g, '<br>');

  // Handle lists (ensuring we don't break numbered lists)
  // Note: This might need refinement depending on exact list formatting
  parsedContent = parsedContent.replace(/^(\d+\.\s)/gm, (match) => `<br>${match}`); // Add break before numbered list items
  parsedContent = parsedContent.replace(/^(-\s|\*\s)/gm, (match) => `<br>${match}`); // Add break before bullet list items


  // Handle Markdown links
  parsedContent = parsedContent.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Basic security check for URL - could be enhanced
    const safeUrl = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/') ? url : '#';
    return `<a href='${safeUrl}' class='tw-underline hover:tw-opacity-80' target='_blank' rel='noopener noreferrer'>${text}</a>`;
  });

  // Handle bold text
  parsedContent = parsedContent.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // Remove any leading <br> that might have been added incorrectly
  parsedContent = parsedContent.replace(/^<br>/, '');

  // Clean up any redundant breaks
  parsedContent = parsedContent.replace(/<br><br><br>/g, '<br><br>');

  return parsedContent;
};
