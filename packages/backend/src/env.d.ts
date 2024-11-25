declare module 'y-websocket/bin/utils' {
  export function setupWSConnection(
    connection: WebSocket,
    request: import('http').IncomingMessage,
    options?: {
      docName?: string;
      gc?: boolean;
    },
  ): void;
}
