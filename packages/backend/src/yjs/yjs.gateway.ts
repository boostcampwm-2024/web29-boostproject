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

import { SpaceData } from 'shared/types';

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

  async bindPersistenceState(docName: string, ydoc: Y.Doc) {
    const { type, id } = parseDocName(docName);

    try {
      if (type === 'note') {
        // note
        const note = await this.noteService.findById(id);
        if (note?.content) {
          const updates = new Uint8Array(Buffer.from(note.content, 'base64'));
          Y.applyUpdate(ydoc, updates);
        }
      }

      if (type === 'space') {
        // space
        const space = await this.spaceService.findById(id);
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
        const yEdges = yContext.get('edges');
        const yNodes = yContext.get('nodes');

        this.logger.log(
          `space writeState: docName: ${id} ydoc:${JSON.stringify(yContext)}`,
        );

        Promise.all([
          this.spaceService.updateByEdges(
            id,
            JSON.parse(JSON.stringify(yEdges)),
          ),
          this.spaceService.updateByNodes(
            id,
            JSON.parse(JSON.stringify(yNodes)),
          ),
        ]);
      }

      if (type === 'note') {
        this.logger.log(`note writeState: docName: ${id}`);
        const updates = Y.encodeStateAsUpdate(ydoc);
        const encodedUpdates = Buffer.from(updates).toString('base64');
        await this.noteService.updateContent(id, encodedUpdates);
      }
    } catch (e) {
      this.logger.error(`writeState`);
    }
  }

  constructor(
    private readonly spaceService: SpaceService,
    private readonly noteService: NoteService,
  ) {
    setPersistence({
      provider: '',
      bindState: this.bindPersistenceState.bind(this),
      writeState: this.writePersistenceState.bind(this),
    });
  }

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
    (async () => {
      // FIXME: 이거 존재하는지만 체크하는 로직으로 변경해야 할 것 같아요
      const space = await this.spaceService.findById(urlId);
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
      // FIXME: 이거 존재하는지만 체크하는 로직으로 변경해야 할 것 같아요
      const note = await this.noteService.findById(urlId);
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
