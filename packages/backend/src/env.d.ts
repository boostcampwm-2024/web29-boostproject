declare module 'y-websocket/bin/utils' {
  export function setPersistence(
    persistence_: {
      bindState: (arg0: string, arg1: WSSharedDoc) => void;
      writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
      provider: any;
    } | null,
  ): void;
  export function getPersistence(): null | {
    bindState: (arg0: string, arg1: WSSharedDoc) => void;
    writeState: (arg0: string, arg1: WSSharedDoc) => Promise<any>;
  } | null;
  export function setContentInitializor(
    f: (ydoc: Y.Doc) => Promise<void>,
  ): void;
  export function setupWSConnection(
    conn: import('ws').WebSocket,
    req: import('http').IncomingMessage,
    { docName, gc }?: any,
  ): void;
  export class WSSharedDoc extends Y.Doc {
    /**
     * @param {string} name
     */
    constructor(name: string);
    name: string;
    /**
     * Maps from conn to set of controlled user ids. Delete all user ids from awareness when this conn is closed
     * @type {Map<Object, Set<number>>}
     */
    conns: Map<any, Set<number>>;
    /**
     * @type {awarenessProtocol.Awareness}
     */
    awareness: awarenessProtocol.Awareness;
    whenInitialized: Promise<void>;
  }
  /**
   * @type {Map<string,WSSharedDoc>}
   */
  export const docs: Map<string, WSSharedDoc>;
  import Y = require('yjs');
  /**
   * Gets a Y.Doc by name, whether in memory or on disk
   *
   * @param {string} docname - the name of the Y.Doc to find or create
   * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
   * @return {WSSharedDoc}
   */
  export function getYDoc(docname: string, gc?: boolean): WSSharedDoc;
  import awarenessProtocol = require('y-protocols/awareness');
}
