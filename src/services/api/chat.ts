import { Message } from '../../components/chat/utils';
import { API_BASE_URL, ACCESS_TOKEN } from '../../config';

let apiKey: string;
let widgetName: string;

export interface InitializeResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  authorized_urls: string[];
}

export const initializeAPI = async (key: string, name: string): Promise<InitializeResponse> => {
  apiKey = key;
  widgetName = name;

  const response = await chatAPI.initialize();
  return response;
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'x-widget-name': widgetName
  };

  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }

  return headers;
};

export interface SendMessageRequest {
  message: string;
  sender: 'user';
  content_type?: string;
  media_url?: string;
  conversation_id?: string;
  client_id?: string;  // Optional since we handle it in the API service
}

export interface ChatResponseItem {
  content_type: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video' | 'follow_up_questions';
  content: string;
  media_url?: string;  // For document, image, video content types
  options?: string[];  // For question content type
  follow_up_questions?: string[];  // For follow-up questions content type
}

export interface ChatResponse {
  // Primary response
  content: string;
  conversation_id: string;
  agent: string;
  sender: 'ai';
  content_type?: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video' | 'follow_up_questions';
  media_url?: string;
  options?: string[];
  follow_up_questions?: string[];

  // Additional responses
  additional_responses?: ChatResponseItem[];
}

// Helper function to get or create client ID
export const getClientId = (): string => {
  const storedClientId = localStorage.getItem('chatClientId');
  if (!storedClientId) {
    // Import uuid dynamically since it's only needed here
    const { v4: uuidv4 } = require('uuid');
    const newClientId = uuidv4();
    localStorage.setItem('chatClientId', newClientId);
    return newClientId;
  }
  return storedClientId;
};

export const chatAPI = {
  initialize: async (): Promise<InitializeResponse> => {
    const response = await fetch(`${API_BASE_URL}/initialize`, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to initialize' }));
      throw new Error(errorData.error || 'Failed to initialize');
    }

    return response.json();
  },

  sendMessage: async (data: SendMessageRequest): Promise<{ message: Message }> => {
    // Ensure client_id is present
    const messageData = {
      ...data,
      client_id: data.client_id || getClientId() // Use the helper function
    };

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(messageData),
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
      follow_up_questions: chatResponse.follow_up_questions,
      additional_responses: chatResponse.additional_responses,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    return { message };
  }
};
