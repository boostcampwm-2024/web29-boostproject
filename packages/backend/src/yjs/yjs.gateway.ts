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
    this.logger.debug(
      `bindPersistenceState: 시작 - docName: ${docName}, ydoc: ${JSON.stringify(ydoc)}`,
    );
    const { type, id } = parseDocName(docName);
    this.logger.debug(`문서 이름 분석 결과 - type: ${type}, id: ${id}`);

    try {
      if (type === 'note') {
        this.logger.debug(`노트 데이터 가져오기 시작 - id: ${id}`);
        const note = await this.collaborativeService.findByNote(id);
        const noteObject = note?.toObject();
        if (noteObject?.content) {
          this.logger.debug(`노트 데이터 업데이트 적용 중 - id: ${id}`);
          const updates = new Uint8Array(
            Buffer.from(noteObject.content, 'base64'),
          );
          Y.applyUpdate(ydoc, updates);
        } else {
          this.logger.debug(`노트 데이터가 비어 있음 - id: ${id}`);
        }
      }
      if (type === 'space') {
        this.logger.debug(`스페이스 데이터 가져오기 시작 - id: ${id}`);
        const space = await this.collaborativeService.findBySpace(id);
        if (!space) {
          this.logger.warn(`스페이스 데이터가 존재하지 않음 - id: ${id}`);
          return;
        }
        this.logger.debug(`스페이스 데이터 분석 및 업데이트 준비 - id: ${id}`);
        const parsedSpace = {
          ...space.toObject(),
          edges: JSON.parse(space.edges),
          nodes: JSON.parse(space.nodes),
        };
        this.logger.debug(
          `분석된 스페이스 데이터 - edges: ${JSON.stringify(parsedSpace.edges)}, nodes: ${JSON.stringify(parsedSpace.nodes)}`,
        );
        this.setYSpace(ydoc, parsedSpace);
      }
    } catch (e) {
      this.logger.error(`상태 바인딩 중 오류 발생 - docName: ${docName}`, e);
    }
  }

  async writePersistenceState(docName: string, ydoc: Y.Doc) {
    this.logger.debug(`writePersistenceState: 시작 - docName: ${docName}`);
    const { type, id } = parseDocName(docName);
    this.logger.debug(`문서 이름 분석 결과 - type: ${type}, id: ${id}`);

    try {
      if (type === 'space') {
        const yContext = ydoc.getMap('context');
        this.logger.debug(
          `스페이스 상태 저장 중 - id: ${id}, context: ${JSON.stringify(yContext.toJSON())}`,
        );
        await this.collaborativeService.updateBySpace(
          id,
          JSON.stringify(yContext.toJSON()),
        );
      }

      if (type === 'note') {
        this.logger.debug(`노트 상태 저장 중 - id: ${id}`);
        const updates = Y.encodeStateAsUpdate(ydoc);
        const encodedUpdates = Buffer.from(updates).toString('base64');
        this.logger.debug(`노트 업데이트 인코딩 완료 - id: ${id}`);
        await this.collaborativeService.updateByNote(id, encodedUpdates);
      }
    } catch (e) {
      this.logger.error(`상태 저장 중 오류 발생 - docName: ${docName}`, e);
    }
  }

  async handleConnection(connection: WebSocket, request: Request) {
    this.logger.log('WebSocket 연결 시작');
    try {
      const url = request.url || '';
      this.logger.debug(`요청된 URL: ${url}`);
      const { urlType, urlId } = parseSocketUrl(url);
      this.logger.debug(`URL 분석 결과 - Type: ${urlType}, ID: ${urlId}`);
      if (!this.validateUrl(urlType, urlId)) {
        this.logger.warn(`유효하지 않은 URL - Type: ${urlType}, ID: ${urlId}`);
        connection.close(
          WebsocketStatus.POLICY_VIOLATION,
          ERROR_MESSAGES.SOCKET.INVALID_URL,
        );
        return;
      }
      this.logger.debug(
        `WebSocket 초기화 시작 - Type: ${urlType}, ID: ${urlId}`,
      );
      urlType === 'space'
        ? await this.initializeSpace(connection, request, urlId as string)
        : await this.initializeNote(connection, request, urlId as string);
    } catch (error) {
      this.logger.error(`WebSocket 연결 실패 - 에러 메시지: ${error.message}`);
    }
  }

  handleDisconnect(connection: WebSocket) {
    this.logger.log(`WebSocket 연결 종료`);
  }

  private validateUrl(urlType: string | null, urlId: string | null): boolean {
    if (!urlType || !urlId || (urlType !== 'space' && urlType !== 'note')) {
      this.logger.debug(
        `유효성 검사 실패 - urlType: ${urlType}, urlId: ${urlId}`,
      );
      return false;
    }
    this.logger.debug(
      `URL 유효성 검사 성공 - urlType: ${urlType}, urlId: ${urlId}`,
    );
    return true;
  }

  private async initializeSpace(
    connection: WebSocket,
    request: Request,
    urlId: string,
  ) {
    this.logger.debug(`스페이스 초기화 시작 - id: ${urlId}`);
    const space = await this.collaborativeService.hasBySpace(urlId);
    if (!space) {
      this.logger.warn(`스페이스 존재하지 않음 - id: ${urlId}`);
      connection.close(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.SPACE.NOT_FOUND,
      );
      return;
    }
    this.logger.debug(`스페이스 존재 확인 - id: ${urlId}`);
    setupWSConnection(connection, request, {
      docName: 'space:' + urlId,
    });
  }

  private async setYSpace(ydoc: Y.Doc, parsedSpace) {
    this.logger.debug(`Yjs 스페이스 설정 시작`);
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
    this.logger.debug(`Yjs 스페이스 설정 완료`);
  }

  private async initializeNote(
    connection: WebSocket,
    request: Request,
    urlId: string,
  ) {
    this.logger.debug(`노트 초기화 시작 - id: ${urlId}`);
    const note = await this.collaborativeService.hasByNote(urlId);
    if (!note) {
      this.logger.warn(`노트 존재하지 않음 - id: ${urlId}`);
      connection.close(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.NOTE.NOT_FOUND,
      );
      return;
    }
    this.logger.debug(`노트 존재 확인 - id: ${urlId}`);
    setupWSConnection(connection, request, {
      docName: 'note:' + urlId,
    });
    this.logger.debug(`노트 초기화 완료 - id: ${urlId}`);
  }
}
