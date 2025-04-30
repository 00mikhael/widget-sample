import { WS_BASE_URL, ACCESS_TOKEN } from '../../config';

export interface ProcessingStatus {
  status: string;
}

let ws: WebSocket | null = null;
let messageHandler: ((data: ProcessingStatus) => void) | null = null;
let retryCount = 0;  // Add retry counter
const MAX_RETRIES = 2;  // Maximum number of retries

export const initWebSocket = (clientId: string) => {
  // Reset retry count on fresh initialization
  if (!ws) {
    retryCount = 0;
  }

  // Return existing connection if it's open
  if (ws?.readyState === WebSocket.OPEN) {
    return {
      onMessage: (handler: (data: ProcessingStatus) => void) => {
        messageHandler = handler;
      }
    };
  }

  // Close existing connection if it's not already closed
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    ws.close();
  }

  if (!WS_BASE_URL) {
    throw new Error('WebSocket URL not initialized');
  }

  const accessTokenParam = ACCESS_TOKEN ? `?access_token=${ACCESS_TOKEN}` : '';
  ws = new WebSocket(`${WS_BASE_URL}/ws/${clientId}${accessTokenParam}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      messageHandler?.(data);
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  };

  // Add reconnection logic with retry limit
  ws.onclose = () => {
    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(() => {
        if (messageHandler) {
          initWebSocket(clientId);
        }
      }, 1000);
    } else {
      console.log('WebSocket reconnection attempts exceeded');
    }
  };

  // Add error handler
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  return {
    onMessage: (handler: (data: ProcessingStatus) => void) => {
      messageHandler = handler;
    }
  };
};
