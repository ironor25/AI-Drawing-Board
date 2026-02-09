/**
 * liveSession.ts
 * Start / stop live session with WebSocket
 */

import { SocketConnection } from "./socket";

export class LiveSession {
  private socket: SocketConnection | null = null;
  private sessionId: string | null = null;
  private isActive: boolean = false;

  async start(wsUrl: string): Promise<string> {
    this.socket = new SocketConnection(wsUrl);

    try {
      await this.socket.connect();

      // Request new session from server
      this.socket.send({ type: "create-session" });

      // Wait for session ID
      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Session creation timeout"));
        }, 5000);

        this.socket?.on("message", (msg: any) => {
          if (msg.type === "session-created") {
            clearTimeout(timeout);
            this.sessionId = msg.sessionId;
            this.isActive = true;
            resolve(msg.sessionId);
          }
        });
      });
    } catch (error) {
      throw error;
    }
  }

  stop(): void {
    if (this.socket) {
      this.socket.send({ type: "close-session", sessionId: this.sessionId });
      this.socket.disconnect();
      this.socket = null;
      this.sessionId = null;
      this.isActive = false;
    }
  }

  send(data: any): void {
    if (this.socket?.isConnected()) {
      this.socket.send({
        type: "canvas-event",
        sessionId: this.sessionId,
        ...data,
      });
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isLive(): boolean {
    return this.isActive;
  }

  on(event: string, callback: (data: any) => void): void {
    this.socket?.on(event, callback);
  }
}
