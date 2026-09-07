type EventHandler = (data: any) => void;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private url: string = '';
  private token: string = '';
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private isDemoMode: boolean = true;
  private isConnected: boolean = false;

  setMode(isDemo: boolean) {
    this.isDemoMode = isDemo;
    if (isDemo && this.ws) {
      this.disconnect();
    }
  }

  connect(url: string, token: string) {
    if (this.isDemoMode) {
      this.isConnected = true;
      return;
    }

    this.url = url;
    this.token = token;
    
    try {
      this.ws = new WebSocket(`${url}?token=${token}`);
      
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          this.notifyHandlers(payload.type, payload.data);
        } catch (e) {
          console.error('Failed to parse WS message', e);
        }
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.handleReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to connect WebSocket', e);
      this.handleReconnect();
    }
  }

  private handleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts || this.isDemoMode) return;
    
    const backoffMs = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;
    
    setTimeout(() => {
      this.connect(this.url, this.token);
    }, backoffMs);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  subscribe(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
  }

  unsubscribe(eventType: string, handler: EventHandler) {
    if (this.handlers.has(eventType)) {
      this.handlers.get(eventType)!.delete(handler);
    }
  }

  private notifyHandlers(eventType: string, data: any) {
    if (this.handlers.has(eventType)) {
      this.handlers.get(eventType)!.forEach(handler => handler(data));
    }
  }

  send(eventType: string, data: any) {
    if (this.isDemoMode) {
      // In demo mode, route directly back to handlers if needed or let simulation engine handle
      return;
    }

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: eventType, data }));
    }
  }
}

export const wsManager = new WebSocketManager();
