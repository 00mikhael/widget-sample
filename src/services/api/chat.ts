import { Message } from '../../components/chat/utils';

let apiKey: string;
let widgetName: string;

export const initializeAPI = (key: string, name: string) => {
  apiKey = key;
  widgetName = name;
};

const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${apiKey}`,
  'X-Widget-Name': widgetName
});

export interface SendMessageRequest {
  message: string;
  sender: 'user';
  content_type?: string;
  media_url?: string;
  conversation_id?: string;
}

export interface ChatResponse {
  content: string;
  conversation_id: string;
  agent: string;
  sender: 'ai';
}

export const chatAPI = {
  sendMessage: async (data: SendMessageRequest): Promise<{ message: Message }> => {
    const response = await fetch('/chat', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const chatResponse: ChatResponse = await response.json();

    // Convert API response to Message format
    const message: Message = {
      id: Date.now(), // Generate a unique ID since API doesn't provide one
      content: chatResponse.content,
      sender: chatResponse.sender,
      agent: chatResponse.agent,
      conversation_id: chatResponse.conversation_id,
      timestamp: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };

    return { message };
  }
};
