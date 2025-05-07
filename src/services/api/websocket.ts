import { WS_BASE_URL, ACCESS_TOKEN } from '../../config';
import { monitoring } from '../monitoring';

export interface ProcessingStatus {
  status: string;
}

let ws: WebSocket | null = null;
let messageHandler: ((data: ProcessingStatus) => void) | null = null;
let retryCount = 0;

export const initWebSocket = (clientId: string, name: string, apiKey: string) => {

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
  try {
    ws = new WebSocket(`${WS_BASE_URL}/ws/${clientId}${accessTokenParam}`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        messageHandler?.(data);
      } catch (error) {
        monitoring.captureError(error as Error, {
          name,
          apiKey,
          message: event.data,
          context: 'websocket_message_parsing'
        });
        console.error('Failed to parse WebSocket message:', error);
      } finally {
      }
    };

    // Reconnection logic with exactly one retry
    ws.onclose = () => {
      if (retryCount === 0) {
        retryCount++;
        setTimeout(() => {
          if (messageHandler) {
            initWebSocket(clientId, name, apiKey);
          }
        }, 1000);
      } else {
        console.log('WebSocket reconnection attempt failed');
      }
    };

    // Add error handler
    ws.onerror = (event) => {
      const error = event instanceof Error ? event : new Error('WebSocket error occurred');
      monitoring.captureError(error, {
        name,
        apiKey,
        context: 'websocket_error_onerror'
      });
      console.error('WebSocket error:', error);
    };

    // Add open handler to track successful connections
    ws.onopen = () => {
    };

    return {
      onMessage: (handler: (data: ProcessingStatus) => void) => {
        messageHandler = handler;
      }
    };
  } catch (error) {
    monitoring.captureError(error as Error, {
      name,
      apiKey,
      context: 'websocket_connection_trycatch'
    });
    throw error;
  }
}
