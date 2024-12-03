import { Test, TestingModule } from '@nestjs/testing';
import { YjsGateway } from './yjs.gateway';
import { CollaborativeService } from '../collaborative/collaborative.service';
import { WebSocket } from 'ws';
import { Request } from 'express';
import { ERROR_MESSAGES } from '../common/constants/error.message.constants';
import { WebsocketStatus } from '../common/constants/websocket.constants';

describe('YjsGateway', () => {
  let gateway: YjsGateway;
  let collaborativeService: CollaborativeService;

  beforeEach(async () => {
    const mockCollaborativeService = {
      findByNote: jest.fn(),
      findBySpace: jest.fn(),
      updateByNote: jest.fn(),
      updateBySpace: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        YjsGateway,
        {
          provide: CollaborativeService,
          useValue: mockCollaborativeService,
        },
      ],
    }).compile();

    gateway = module.get<YjsGateway>(YjsGateway);
    collaborativeService =
      module.get<CollaborativeService>(CollaborativeService);
  });

  describe('handleConnection', () => {
    it('유효하지 않은 URL로 WebSocket 연결을 닫아야 한다', async () => {
      const connection = {
        close: jest.fn(),
      } as unknown as WebSocket;

      const request = {
        url: '/invalid-url',
      } as Request;

      await gateway.handleConnection(connection, request);

      expect(connection.close).toHaveBeenCalledWith(
        WebsocketStatus.POLICY_VIOLATION,
        ERROR_MESSAGES.SOCKET.INVALID_URL,
      );
    });

    it('유효한 노트 URL로 WebSocket 연결을 초기화해야 한다', async () => {
      const connection = {
        close: jest.fn(),
      } as unknown as WebSocket;

      const request = {
        url: '/note/123',
      } as Request;

      (collaborativeService.findByNote as jest.Mock).mockResolvedValue({
        id: '123',
      });

      await gateway.handleConnection(connection, request);

      expect(collaborativeService.findByNote).toHaveBeenCalledWith('123');
    });

    it('유효한 스페이스 URL로 WebSocket 연결을 초기화해야 한다', async () => {
      const connection = {
        close: jest.fn(),
      } as unknown as WebSocket;

      const request = {
        url: '/space/123',
      } as Request;

      (collaborativeService.findBySpace as jest.Mock).mockResolvedValue({
        id: '123',
      });

      await gateway.handleConnection(connection, request);

      expect(collaborativeService.findBySpace).toHaveBeenCalledWith('123');
    });
  });
});
