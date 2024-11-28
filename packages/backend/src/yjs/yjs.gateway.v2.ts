import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { parseSocketUrl } from 'src/note/common/utils/socket.util';
import { WebsocketStatus } from 'src/note/common/constants/websocket.constants';
import { Server, WebSocket } from 'ws';
import { Request } from 'express';
import {
  setupWSConnection,
  setPersistence,
  setContentInitializor,
} from 'y-websocket/bin/utils';
import * as Y from 'yjs';
import { ERROR_MESSAGES } from 'src/note/common/constants/error.message.constants';
import { CollaborativeService } from 'src/collaborative/collaborative.service';
import { LoggerService } from 'src/note/common/logger/logger.service';
const SPACE = 'space';

@WebSocketGateway(9002)
export class YjsGatewayV2 implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly collaborativeService: CollaborativeService,
    private readonly logger: LoggerService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    try {
      const url = request.url || '';
      const { urlType, urlId } = parseSocketUrl(url);
      this.logger.info('WebSocket connection attempt', {
        method: 'handleConnection',
        url: request.url,
        urlType,
        urlId,
        remoteAddress: request.socket.remoteAddress,
      });
      if (!this.validateUrl(urlType, urlId)) {
        this.logger.error('Invalid WebSocket URL', {
          method: 'handleConnection',
          url: request.url,
          urlType,
          urlId,
          error: ERROR_MESSAGES.SOCKET.INVALID_URL,
        });
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SOCKET.INVALID_URL,
        );
        return;
      }
      urlType === SPACE
        ? await this.initializeSpace(connection, request, urlId as string)
        : await this.initializeNote(connection, request, urlId as string);
    } catch (error) {
      this.logger.error('WebSocket connection failed', {
        method: 'handleConnection',
        error: error.message,
        stack: error.stack,
        url: request.url,
      });
    }
  }

  handleDisconnect(connection: WebSocket) {
    this.logger.info('WebSocket disconnected', {
      method: 'handleDisconnect',
      timestamp: new Date().toISOString(),
    });
  }

  private validateUrl(urlType: string | null, urlId: string | null): boolean {
    if (!urlType || !urlId || (urlType !== 'space' && urlType !== 'note')) {
      return false;
    }
    return true;
  }

  private async initializeSpace(
    connection: WebSocket,
    request: Request,
    urlId: string,
  ) {
    setPersistence({
      provider: '',
      bindState: (docName: string, ydoc: Y.Doc) => {
        try {
          const yContext = ydoc.getMap('context');
          this.logger.info('Space bindState called', {
            method: 'bindState',
            docName,
            urlId,
            contextSize: yContext.size,
          });
        } catch (error) {
          this.logger.error('Error in space bindState', {
            method: 'bindState',
            docName,
            urlId,
            error: error.message,
            stack: error.stack,
          });
        }
      },
      writeState: (docName: string, ydoc: Y.Doc) => {
        try {
          const yContext = ydoc.getMap('context');
          this.logger.info('Space writeState called', {
            method: 'writeState',
            docName,
            urlId,
            contextSize: yContext.size,
          });
          this.collaborativeService.updateBySpace(
            urlId,
            JSON.stringify(yContext),
          );
          this.logger.info('Space state updated successfully', {
            method: 'writeState',
            docName,
            urlId,
          });
        } catch (error) {
          this.logger.error('Error in space writeState', {
            method: 'writeState',
            docName,
            urlId,
            error: error.message,
            stack: error.stack,
          });
        }
        return Promise.resolve();
      },
    });

    setContentInitializor(async (ydoc) => {
      try {
        const space = await this.collaborativeService.findBySpace(urlId);
        if (!space) {
          this.logger.error('Space not found during initialization', {
            method: 'setContentInitializor',
            urlId,
          });
          return;
        }

        const parsedSpace = {
          ...space,
          edges: JSON.parse(space.edges),
          nodes: JSON.parse(space.nodes),
        };

        this.logger.info('Space content initialization started', {
          method: 'setContentInitializor',
          urlId,
          edgesCount: Object.keys(parsedSpace.edges).length,
          nodesCount: Object.keys(parsedSpace.nodes).length,
        });
        this.setYSpace(ydoc, parsedSpace);

        this.logger.info('Space content initialized successfully', {
          method: 'setContentInitializor',
          urlId,
        });
      } catch (error) {
        this.logger.error('Error initializing space content', {
          method: 'setContentInitializor',
          urlId,
          error: error.message,
          stack: error.stack,
        });
      }
      return Promise.resolve();
    });

    setupWSConnection(connection, request, {
      docName: urlId,
    });
  }

  private async setYSpace(ydoc: Y.Doc, parsedSpace) {
    const yContext = ydoc.getMap('context');
    const yEdges = new Y.Map();
    const yNodes = new Y.Map();
    const edges = parsedSpace.edges;
    const nodes = parsedSpace.nodes;
    Object.entries(edges).forEach(([edgeId, edge]) => {
      yEdges.set(edgeId, edge);
    });
    Object.entries(nodes).forEach(([nodeId, node]) => {
      yNodes.set(nodeId, node);
    });
    yContext.set('edges', yEdges);
    yContext.set('nodes', yNodes);
  }

  private async initializeNote(
    connection: WebSocket,
    request: Request,
    urlId: string,
  ) {
    try {
      this.logger.info('Initializing note connection', {
        method: 'initializeNote',
        urlId,
      });

      const note = await this.collaborativeService.findByNote(urlId);
      if (!note) {
        this.logger.error('Note not found', {
          method: 'initializeNote',
          urlId,
          error: ERROR_MESSAGES.NOTE.NOT_FOUND,
        });
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.NOTE.NOT_FOUND,
        );
        return;
      }

      setPersistence({
        provider: '',
        bindState: async (docName: string, ydoc: Y.Doc) => {
          try {
            if (note.content) {
              const updates = new Uint8Array(
                Buffer.from(note.content, 'base64'),
              );
              Y.applyUpdate(ydoc, updates);
              this.logger.info('Note state bound successfully', {
                method: 'bindState',
                docName,
                urlId,
                hasContent: true,
              });
            }
          } catch (error) {
            this.logger.error('Error binding note state', {
              method: 'bindState',
              docName,
              urlId,
              error: error.message,
              stack: error.stack,
            });
          }
        },
        writeState: async (docName: string, ydoc: Y.Doc) => {
          try {
            const updates = Y.encodeStateAsUpdate(ydoc);
            const encodedUpdates = Buffer.from(updates).toString('base64');
            await this.collaborativeService.updateByNote(urlId, encodedUpdates);

            this.logger.info('Note state updated successfully', {
              method: 'writeState',
              docName,
              urlId,
              updateSize: updates.length,
            });
          } catch (error) {
            this.logger.error('Error writing note state', {
              method: 'writeState',
              docName,
              urlId,
              error: error.message,
              stack: error.stack,
            });
          }
        },
      });

      setupWSConnection(connection, request);
      this.logger.info('Note connection initialized successfully', {
        method: 'initializeNote',
        urlId,
        status: 'connected',
      });
    } catch (error) {
      this.logger.error('Error in note initialization', {
        method: 'initializeNote',
        urlId,
        error: error.message,
        stack: error.stack,
      });
    }
  }
}
