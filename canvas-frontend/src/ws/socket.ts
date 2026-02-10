// /**
//  * socket.ts
//  * WebSocket connection management (lazy initialization)
//  */

// export class SocketConnection {
//   private socket: WebSocket | null = null;
//   private url: string;
//   private connected: boolean = false;
//   private reconnectAttempts: number = 0;
//   private maxReconnectAttempts: number = 5;

//   constructor(url: string) {
//     this.url = url;
//   }

//   connect(): Promise<void> {
//     return new Promise((resolve, reject) => {
//       if (this.socket?.readyState === WebSocket.OPEN) {
//         resolve();
//         return;
//       }

//       const socket = new WebSocket(this.url);

//       socket.onopen = () => {
//         this.socket = socket;
//         this.connected = true;
//         this.reconnectAttempts = 0;
//         resolve();
//       };

//       socket.onerror = () => {
//         reject(new Error("WebSocket connection failed"));
//       };
//     });
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.close();
//       this.socket = null;
//       this.connected = false;
//     }
//   }

//   send(data: any): void {
//     if (this.socket?.readyState === WebSocket.OPEN) {
//       this.socket.send(JSON.stringify(data));
//     }
//   }

//   on(event: string, callback: (data: any) => void): void {
//     if (!this.socket) return;

//     if (event === "message") {
//       this.socket.onmessage = (e) => callback(JSON.parse(e.data));
//     } else if (event === "close") {
//       this.socket.onclose = () => callback(null);
//     } else if (event === "error") {
//       this.socket.onerror = (e) => callback(e);
//     }
//   }

//   isConnected(): boolean {
//     return this.connected && this.socket?.readyState === WebSocket.OPEN;
//   }
// }
