export interface ProcessingStatus {
  status: string;  // Single field for the status text
}

let globalWsService: WebSocketService | null = null;

export class WebSocketService {
  private ws: WebSocket | null = null;
  private clientId: string;
  private onMessageCallbacks: ((data: ProcessingStatus) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
  private baseUrl: string;

  constructor(clientId: string, baseUrl: string) {
    this.clientId = clientId;
    this.baseUrl = baseUrl;
  }

  connect(): void {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(`${this.baseUrl}/ws/${this.clientId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connection established');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const data: ProcessingStatus = JSON.parse(event.data);
          this.onMessageCallbacks.forEach(callback => callback(data));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.attemptReconnect();
      };
    } catch (error) {
      console.error('Failed to connect WebSocket:', error);
      this.attemptReconnect();
    }
  }

  onMessage(callback: (data: ProcessingStatus) => void): void {
    // Clear any existing callbacks with the same function
    this.onMessageCallbacks = this.onMessageCallbacks.filter(cb => cb !== callback);
    // Add the new callback
    this.onMessageCallbacks.push(callback);
  }

  close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnect attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      this.connect();
    }, delay);
  }
}

export const initWebSocket = (clientId: string, baseUrl: string): WebSocketService => {
  if (!globalWsService) {
    globalWsService = new WebSocketService(clientId, baseUrl);
    globalWsService.connect();
  }
  return globalWsService;
};

export const getWebSocketService = (): WebSocketService | null => {
  return globalWsService;
};
