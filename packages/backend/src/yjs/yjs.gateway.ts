import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { SpaceService } from 'src/space/space.service';

import { NoteService } from 'src/note/note.service';
import { parseSocketUrl } from 'src/common/utils/socket.util';
import { WebsocketStatus } from 'src/common/constants/websocket.constants';
import { Server } from 'ws';
import { Request } from 'express';
import { setupWSConnection } from 'y-websocket/bin/utils';
import * as Y from 'yjs';
import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
const SPACE = 'space';
const NOTE = 'note';

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
      if (!this.validateUrl(urlType, urlId)) {
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SOCKET.INVALID_URL,
        );
        return;
      }
      this.logger.log(`Parsed URL - Type: ${urlType}, ID: ${urlId}`);
      urlType === SPACE
        ? await this.initializeSpace(connection, request, urlId as string)
        : await this.initializeNote(connection, request, urlId as string);
    } catch (error) {
      this.logger.error(`Connection failed for : ${error.message}`);
    }
  }

  handleDisconnect() {
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
    const space = await this.spaceService.findById(urlId);
    if (!space) {
      connection.close(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.SPACE.NOT_FOUND,
      );
      return;
    }
    setupWSConnection(connection, request, {
      docName: space.name,
    });
  }

  private async initializeNote(
    connection: WebSocket,
    request: Request,
    urlId: string,
  ) {
    const note = await this.noteService.findById(urlId);
    if (!note) {
      connection.close(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.NOTE.NOT_FOUND,
      );
      return;
    }
    setupWSConnection(connection, request, {
      docName: note.name,
    });
  }
}
