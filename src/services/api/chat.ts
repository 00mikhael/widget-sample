import { Message } from '../../components/chat/utils';
import { API_BASE_URL, AUTH_BASE_URL, ACCESS_TOKEN, setApiKey, getApiKey, updateConfig } from '../../config';

let widgetName: string;
export let tokenRefreshTimeout: NodeJS.Timeout | null = null;
const MAX_TOKEN_REFRESH_RETRIES = 1;  // One retry after initial attempt = 2 total attempts
const TOKEN_REFRESH_INTERVAL = 1800000;  // 30 minutes in milliseconds

const performTokenRefresh = async (retryCount = 0): Promise<void> => {
  try {
    const apiKey = getApiKey();
    if (!apiKey) {
      throw new Error('API key not found');
    }

    const response = await fetch(`${AUTH_BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-widget-name': widgetName
      }
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const authResponse = await response.json();
    updateConfig(authResponse);
  } catch (error) {
    console.error(`Token refresh attempt ${retryCount + 1} failed:`, error);

    if (retryCount < MAX_TOKEN_REFRESH_RETRIES) {
      await performTokenRefresh(retryCount + 1);
    } else {
      throw new Error('Token refresh retry limit exceeded');
    }
  }
};

const scheduleNextTokenRefresh = () => {
  if (tokenRefreshTimeout) {
    clearTimeout(tokenRefreshTimeout);
  }

  tokenRefreshTimeout = setTimeout(async () => {
    try {
      await performTokenRefresh();
    } finally {
      // Always schedule next refresh, even after failure
      scheduleNextTokenRefresh();
    }
  }, TOKEN_REFRESH_INTERVAL);
};

const startTokenRefresh = () => {
  scheduleNextTokenRefresh();
  return () => {
    if (tokenRefreshTimeout) {
      clearTimeout(tokenRefreshTimeout);
      tokenRefreshTimeout = null;
    }
  };
};

export interface AuthResponse {
  token: {
    access_token: string;
    token_type: string;
  };
  authorized_urls: string[];
}

export const authAPI = {
  initialize: async (name: string, apiKey: string): Promise<AuthResponse> => {
    setApiKey(apiKey);
    widgetName = name;

    const response = await fetch(`${AUTH_BASE_URL}/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-widget-name': name
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to initialize' }));
      throw new Error(errorData.error || 'Failed to initialize');
    }

    const authResponse = await response.json();
    updateConfig(authResponse);

    // Start token refresh in background
    startTokenRefresh();

    return authResponse;
  },

  refreshToken: async (): Promise<void> => {
    return performTokenRefresh();
  }
};

const getHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (ACCESS_TOKEN) {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }

  return headers;
};

// Helper function to make API calls with token refresh logic
const makeAPICall = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  if (!API_BASE_URL) {
    throw new Error('API URL not initialized');
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      // Try refresh token with its own retry mechanism
      await performTokenRefresh();

      // Retry the call with new token
      const headers = await getHeaders();
      const retryOptions = { ...options, headers };
      return makeAPICall(url, retryOptions);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || 'Request failed');
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

export interface SendMessageRequest {
  message: string;
  sender: 'user';
  content_type?: string;
  media_url?: string;
  conversation_id?: string;
  client_id?: string;
}

export interface ChatResponseItem {
  content_type: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video' | 'follow_up_questions';
  content: string;
  media_url?: string;
  options?: string[];
  follow_up_questions?: string[];
}

export interface ChatResponse {
  content: string;
  conversation_id: string;
  agent: string;
  sender: 'ai';
  content_type?: 'text' | 'text_image' | 'question' | 'document' | 'image' | 'video' | 'follow_up_questions';
  media_url?: string;
  options?: string[];
  follow_up_questions?: string[];
  additional_responses?: ChatResponseItem[];
}

// Helper function to get or create client ID
export const getClientId = async (): Promise<string> => {
  const storedClientId = localStorage.getItem('chatClientId');
  if (!storedClientId) {
    const { v4: uuidv4 } = await import('uuid');
    const newClientId = uuidv4();
    localStorage.setItem('chatClientId', newClientId);
    return newClientId;
  }
  return storedClientId;
};

export const chatAPI = {
  sendMessage: async (data: SendMessageRequest): Promise<{ message: Message }> => {
    const messageData = {
      ...data,
      client_id: data.client_id || getClientId()
    };

    const chatResponse: ChatResponse = await makeAPICall(
      `${API_BASE_URL}/chat`,
      {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(messageData),
      }
    );

    const message: Message = {
      id: Date.now(),
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
