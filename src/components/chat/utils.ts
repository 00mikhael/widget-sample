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

let apiKey: string;
let widgetName: string;

export const initializeAPI = (key: string, name: string) => {
  apiKey = key;
  widgetName = name;
};

import { API_BASE_URL } from '../../config';

// Types
export interface Message {
  id: number | string;
  content: string;
  sender: 'user' | 'ai';
  timestamp?: string;
  content_type?: 'text' | 'text_image';
  agent?: string;
  conversation_id?: string;
}

export interface CurrentChat {
  user: Message | null;
  ai: Message | null;
}

// API Setup
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'X-Widget-Name': widgetName
});

export const fetchHistoryAPI = async (): Promise<{ history: Message[] }> => {
  console.log('API CALL: fetchHistoryAPI');
  try {
    const response = await fetch(`${API_BASE_URL}/chat/history`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to fetch chat history');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching history:', error);
    return { history: [] };
  }
};

export const sendMessageAPI = async (messageData: { message: string; sender: 'user'; content_type?: string; media_url?: string; conversation_id?: string }): Promise<{ message: Message }> => {
  console.log('API CALL: sendMessageAPI', messageData);
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData)
    });
    if (!response.ok) throw new Error('Failed to send message');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error sending message:', error);
    // Return simulated response for now
    const aiResponse: Message = {
      id: Date.now() + 1,
      sender: 'ai',
      content: `This is a simulated AI response to: "${messageData.message}". The actual API needs to be implemented.`,
      timestamp: new Date().toLocaleTimeString(),
    };
    return { message: aiResponse };
  }
};

export const clearChatAPI = async (): Promise<void> => {
  console.log('API CALL: clearChatAPI');
  try {
    const response = await fetch(`${API_BASE_URL}/chat/clear`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Failed to clear chat');
  } catch (error) {
    console.error('Error clearing chat:', error);
  }
};
