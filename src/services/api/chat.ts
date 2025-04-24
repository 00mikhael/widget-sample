import { Message } from '../../components/chat/utils';
import { API_BASE_URL } from '../../config';

let apiKey: string;
let widgetName: string;

export const initializeAPI = (key: string, name: string) => {
  apiKey = key;
  widgetName = name;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'X-Api-Key': apiKey,
  'X-Widget-Name': widgetName
});

export interface SendMessageRequest {
  message: string;
  sender: 'user';
  content_type?: string;
  media_url?: string;
  conversation_id?: string;
}

export interface ChatResponseItem {
  content_type: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video';
  content: string;
  media_url?: string;  // For document, image, video content types
  options?: string[];  // For question content type
}

export interface ChatResponse {
  // Primary response
  content: string;
  conversation_id: string;
  agent: string;
  sender: 'ai';
  content_type?: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video';
  media_url?: string;
  options?: string[];

  // Additional responses
  additional_responses?: ChatResponseItem[];
}

export const chatAPI = {
  sendMessage: async (data: SendMessageRequest): Promise<{ message: Message }> => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to send message' }));
      throw new Error(errorData.error || 'Failed to send message');
    }

    const chatResponse: ChatResponse = await response.json();

    // Convert API response to Message format
    const message: Message = {
      id: Date.now(), // Generate a unique ID since API doesn't provide one
      content: chatResponse.content,
      sender: chatResponse.sender,
      agent: chatResponse.agent,
      conversation_id: chatResponse.conversation_id,
      content_type: chatResponse.content_type,
      media_url: chatResponse.media_url,
      options: chatResponse.options,
      additional_responses: chatResponse.additional_responses,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    return { message };
  }
};
