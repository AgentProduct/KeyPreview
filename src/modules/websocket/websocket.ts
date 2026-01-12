/**
 * WebSocket testing utility
 * Handles WebSocket connections and message sending/receiving
 */

export interface WebSocketMessage {
  type: 'send' | 'receive' | 'error' | 'system';
  content: string;
  timestamp: number;
}

export class WebSocketTester {
  private ws: WebSocket | null = null;
  private messages: WebSocketMessage[] = [];
  private onMessageCallback: ((message: WebSocketMessage) => void) | null = null;
  private onStatusChangeCallback: ((connected: boolean) => void) | null = null;

  /**
   * Connect to WebSocket server
   */
  connect(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          this.addMessage('system', '连接成功');
          if (this.onStatusChangeCallback) {
            this.onStatusChangeCallback(true);
          }
          resolve(true);
        };

        this.ws.onmessage = (event) => {
          this.addMessage('receive', event.data);
        };

        this.ws.onerror = (error) => {
          this.addMessage('error', `连接错误: ${error.message || '未知错误'}`);
          if (this.onStatusChangeCallback) {
            this.onStatusChangeCallback(false);
          }
          resolve(false);
        };

        this.ws.onclose = () => {
          this.addMessage('system', '连接已关闭');
          if (this.onStatusChangeCallback) {
            this.onStatusChangeCallback(false);
          }
        };
      } catch (error) {
        this.addMessage('error', `连接失败: ${error instanceof Error ? error.message : '未知错误'}`);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Send message to WebSocket server
   */
  send(message: string): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.addMessage('error', '未连接到服务器');
      return false;
    }

    try {
      this.ws.send(message);
      this.addMessage('send', message);
      return true;
    } catch (error) {
      this.addMessage('error', `发送失败: ${error instanceof Error ? error.message : '未知错误'}`);
      return false;
    }
  }

  /**
   * Add message to history
   */
  private addMessage(type: WebSocketMessage['type'], content: string): void {
    const message: WebSocketMessage = {
      type,
      content,
      timestamp: Date.now(),
    };
    this.messages.push(message);
    
    // Keep message history to a reasonable size
    if (this.messages.length > 100) {
      this.messages.shift();
    }
    
    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }
  }

  /**
   * Set callback for new messages
   */
  setOnMessageCallback(callback: (message: WebSocketMessage) => void): void {
    this.onMessageCallback = callback;
  }

  /**
   * Set callback for status changes
   */
  setOnStatusChangeCallback(callback: (connected: boolean) => void): void {
    this.onStatusChangeCallback = callback;
  }

  /**
   * Get all messages
   */
  getMessages(): WebSocketMessage[] {
    return [...this.messages];
  }

  /**
   * Clear message history
   */
  clearMessages(): void {
    this.messages = [];
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

/**
 * Format timestamp to readable string
 */
export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString();
}

/**
 * Format message content for display
 */
export function formatMessageContent(content: string): string {
  try {
    // Try to pretty print JSON
    const parsed = JSON.parse(content);
    return JSON.stringify(parsed, null, 2);
  } catch {
    // Not JSON, return as is
    return content;
  }
}