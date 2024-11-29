import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { parseSocketUrl } from 'src/common/utils/socket.util';
import { WebsocketStatus } from 'src/common/constants/websocket.constants';
import { Server, WebSocket } from 'ws';
import { Request } from 'express';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import * as Y from 'yjs';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import { CollaborativeService } from 'src/collaborative/collaborative.service';

function parseDocName(docName: string) {
  const [type, id] = docName.split(':');

  if (type === 'space' || type === 'note') {
    return { type: type as 'space' | 'note', id };
  }

  throw new Error('Invalid docName');
}

@WebSocketGateway(9001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(YjsGateway.name);

  constructor(private readonly collaborativeService: CollaborativeService) {
    setPersistence({
      provider: '',
      bindState: this.bindPersistenceState.bind(this),
      writeState: this.writePersistenceState.bind(this),
    });
  }
  @WebSocketServer()
  server: Server;

  async bindPersistenceState(docName: string, ydoc: Y.Doc) {
    const { type, id } = parseDocName(docName);
    try {
      if (type === 'note') {
        const note = await this.collaborativeService.findByNote(id);
        if (note?.content) {
          const updates = new Uint8Array(Buffer.from(note.content, 'base64'));
          Y.applyUpdate(ydoc, updates);
        }
      }
      if (type === 'space') {
        const space = await this.collaborativeService.findBySpace(id);
        if (!space) {
          return;
        }
        this.logger.log(
          `space bindState: docName: ${id} ydoc:${JSON.stringify(ydoc)}`,
        );
        const parsedSpace = {
          ...space,
          edges: JSON.parse(space.edges),
          nodes: JSON.parse(space.nodes),
        };
        this.setYSpace(ydoc, parsedSpace);
      }
    } catch (e) {
      this.logger.error(`error while bindState`, e);
    }
  }

  async writePersistenceState(docName: string, ydoc: Y.Doc) {
    const { type, id } = parseDocName(docName);

    try {
      if (type === 'space') {
        const yContext = ydoc.getMap('context');

        this.logger.log(
          `space writeState: docName: ${id} ydoc:${JSON.stringify(yContext.toJSON)}`,
        );
        await this.collaborativeService.updateBySpace(
          id,
          JSON.stringify(yContext.toJSON),
        );
      }

      if (type === 'note') {
        this.logger.log(`note writeState: docName: ${id}`);
        const updates = Y.encodeStateAsUpdate(ydoc);
        const encodedUpdates = Buffer.from(updates).toString('base64');
        await this.collaborativeService.updateByNote(id, encodedUpdates);
      }
    } catch (e) {
      this.logger.error(`writeState`);
    }
  }

  async handleConnection(connection: WebSocket, request: Request) {
    this.logger.log('connection start');
    try {
      const url = request.url || '';
      const { urlType, urlId } = parseSocketUrl(url);
      this.logger.log(`url ${request.url}`);
      this.logger.log(`Parsed URL - Type: ${urlType}, ID: ${urlId}`);
      if (!this.validateUrl(urlType, urlId)) {
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SOCKET.INVALID_URL,
        );
        return;
      }
      urlType === 'space'
        ? await this.initializeSpace(connection, request, urlId as string)
        : await this.initializeNote(connection, request, urlId as string);
    } catch (error) {
      this.logger.error(`Connection failed for : ${error.message}`);
    }
  }

  handleDisconnect(connection: WebSocket) {
    this.logger.log(`connection end`);
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
    (async () => {
      const space = await this.collaborativeService.hasBySpace(urlId);
      if (!space) {
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SPACE.NOT_FOUND,
        );
      }
    })();

    setupWSConnection(connection, request, {
      docName: 'space:' + urlId,
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
    this.logger.log(`initializeNote `);
    (async () => {
      const note = await this.collaborativeService.hasByNote(urlId);
      if (!note) {
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.NOTE.NOT_FOUND,
        );
      }
    })();

    setupWSConnection(connection, request, {
      docName: 'note:' + urlId,
    });
    this.logger.log(`connection complete`);
  }
}
