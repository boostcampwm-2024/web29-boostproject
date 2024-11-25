import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { SpaceService } from 'src/space/space.service';

import { NoteService } from 'src/note/note.service';
import { parseSocketUrl } from 'src/common/utils/socket.util';
import { WebsocketStatus } from 'src/common/constants/websocket.constants';
import { Server, WebSocket } from 'ws';
import { Request } from 'express';
import {
  setupWSConnection,
  setPersistence,
  setContentInitializor,
} from 'y-websocket/bin/utils';
import * as Y from 'yjs';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
import {
  yXmlFragmentToProsemirrorJSON,
  prosemirrorJSONToYXmlFragment,
  // @ts-expect-error /
} from 'y-prosemirror';
import { generateUuid } from 'src/common/utils/url.utils';
const SPACE = 'space';
const NOTE = 'note';

import { SpaceData } from 'shared/types';

@WebSocketGateway(9001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(YjsGateway.name);
  constructor(
    private readonly spaceService: SpaceService,
    private readonly noteService: NoteService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    this.logger.log('connection start');

    try {
      const url = request.url || '';
      const { urlType, urlId } = parseSocketUrl(url);
      this.logger.log(`url ${request.url}`);
      this.logger.log(`Parsed URL - Type: ${urlType}, ID: ${urlId}`);
      this.logger.log(`Parsed URL - Type: ${urlType}, ID: ${urlId}`);
      if (!this.validateUrl(urlType, urlId)) {
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
    setPersistence({
      provider: '',
      bindState: (docName: string, ydoc: Y.Doc) => {
        try {
          const yContext = ydoc.getMap('context');
          this.logger.log(
            `space bindState: docName: ${docName} urlId: ${urlId} ydoc:${JSON.stringify(yContext)}`,
          );
        } catch (e) {
          this.logger.error(`writeState`);
        }
      },
      writeState: (docName: string, ydoc: Y.Doc) => {
        try {
          const yContext = ydoc.getMap('context');
          const yEdges = yContext.get('edges');
          const yNodes = yContext.get('nodes');

          this.logger.log(
            `space writeState: docName: ${docName} urlId: ${urlId} ydoc:${JSON.stringify(yContext)}`,
          );
          this.spaceService.updateByEdges(
            urlId,
            JSON.parse(JSON.stringify(yEdges)),
          );
          this.spaceService.updateByNodes(
            urlId,
            JSON.parse(JSON.stringify(yNodes)),
          );
        } catch (e) {
          this.logger.error(`writeState`);
        }

        return Promise.resolve();
      },
    });

    setContentInitializor(async (ydoc) => {
      const space = await this.spaceService.findById(urlId);
      if (!space) {
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SPACE.NOT_FOUND,
        );
        return;
      }

      const parsedSpace = {
        ...space,
        edges: JSON.parse(space.edges),
        nodes: JSON.parse(space.nodes),
      };
      this.setYSpace(ydoc, parsedSpace);
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
    this.logger.log(`initializeNote `);
    const note = await this.noteService.findById(urlId);
    if (!note) {
      connection.close(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.NOTE.NOT_FOUND,
      );
      return;
    }

    setPersistence({
      provider: '',
      bindState: async (docName: string, ydoc: Y.Doc) => {
        if (note.content) {
          const updates = new Uint8Array(Buffer.from(note.content, 'base64'));
          Y.applyUpdate(ydoc, updates);
        }
      },
      writeState: async (docName: string, ydoc: Y.Doc) => {
        const updates = Y.encodeStateAsUpdate(ydoc);
        const encodedUpdates = Buffer.from(updates).toString('base64');
        await this.noteService.updateContent(urlId, encodedUpdates);
      },
    });

    setupWSConnection(connection, request);
    this.logger.log(`connection complete`);
  }
}
