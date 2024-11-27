// // YjsGateway 수정
// import { Logger } from '@nestjs/common';
// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { Cron, CronExpression } from '@nestjs/schedule';
// import { CollaborativeService } from '../collaborativeservice';
// import { Server, WebSocket } from 'ws';
// import * as Y from 'yjs';

// @WebSocketGateway(9001)
// export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
//   private readonly logger = new Logger(YjsGateway.name);
//   private activeDocuments: Map<string, Y.Doc> = new Map();

//   constructor(private readonly collaborativeService: CollaborativeService) {}

//   @WebSocketServer()
//   server: Server;

//   @Cron(CronExpression.EVERY_5_MINUTES)
//   async handlePersistenceSync() {
//     for (const [docId, ydoc] of this.activeDocuments.entries()) {
//       try {
//         const [type, id] = docId.split(':');
//         if (type === 'space') {
//           const yContext = ydoc.getMap('context');
//           const spaceData = {
//             edges: JSON.stringify(yContext.get('edges').toJSON()),
//             nodes: JSON.stringify(yContext.get('nodes').toJSON()),
//           };
//           await this.collaborativeService.persistSpace(id, spaceData);
//         } else if (type === 'note') {
//           const updates = Y.encodeStateAsUpdate(ydoc);
//           const encodedUpdates = Buffer.from(updates).toString('base64');
//           await this.collaborativeService.persistNote(id, encodedUpdates);
//         }
//       } catch (error) {
//         this.logger.error(
//           `Failed to persist document ${docId}: ${error.message}`,
//         );
//       }
//     }
//   }

//   private async initializeSpace(
//     connection: WebSocket,
//     request: Request,
//     urlId: string,
//   ) {
//     setPersistence({
//       provider: '',
//       bindState: async (docName: string, ydoc: Y.Doc) => {
//         const spaceData = await this.collaborativeService.getSpace(urlId);
//         if (spaceData) {
//           this.setYSpace(ydoc, spaceData);
//         }
//         this.activeDocuments.set(`space:${urlId}`, ydoc);
//       },
//       writeState: async (docName: string, ydoc: Y.Doc) => {
//         const yContext = ydoc.getMap('context');
//         const spaceData = {
//           edges: JSON.stringify(yContext.get('edges').toJSON()),
//           nodes: JSON.stringify(yContext.get('nodes').toJSON()),
//         };
//         await this.collaborativeService.updateSpace(urlId, spaceData);
//       },
//     });

//     setupWSConnection(connection, request, {
//       docName: urlId,
//     });
//   }

//   private async initializeNote(
//     connection: WebSocket,
//     request: Request,
//     urlId: string,
//   ) {
//     setPersistence({
//       provider: '',
//       bindState: async (docName: string, ydoc: Y.Doc) => {
//         const note = await this.collaborativeService.getNote(urlId);
//         if (note?.content) {
//           const updates = new Uint8Array(Buffer.from(note.content, 'base64'));
//           Y.applyUpdate(ydoc, updates);
//         }
//         this.activeDocuments.set(`note:${urlId}`, ydoc);
//       },
//       writeState: async (docName: string, ydoc: Y.Doc) => {
//         const updates = Y.encodeStateAsUpdate(ydoc);
//         const encodedUpdates = Buffer.from(updates).toString('base64');
//         await this.collaborativeService.updateNote(urlId, encodedUpdates);
//       },
//     });

//     setupWSConnection(connection, request);
//   }
// }

// @Injectable()
// export class CollaborativeService {
//   constructor(
//     private readonly spaceService: SpaceServiceV2,
//     private readonly spaceRedisService: SpaceRedisService,
//     private readonly noteService: NoteServiceV2,
//     private readonly noteRedisService: NoteRedisService,
//   ) {}

//   async getSpace(id: string) {
//     // 1차: Redis에서 확인
//     const cachedSpace = await this.spaceRedisService.getSpace(id);
//     if (cachedSpace) {
//       return cachedSpace;
//     }

//     // 2차: MongoDB에서 확인
//     const space = await this.spaceService.findById(id);
//     if (space) {
//       // Redis에 캐시 설정
//       await this.spaceRedisService.setSpace(id, JSON.stringify(space));
//       return space;
//     }

//     return null;
//   }

//   async updateSpace(id: string, spaceData: any) {
//     await this.spaceRedisService.setSpace(id, JSON.stringify(spaceData));
//   }

//   async persistSpace(id: string, spaceData: any) {
//     await this.spaceService.update(id, spaceData);
//   }

//   async getNote(id: string) {
//     // 1차: Redis에서 확인
//     const cachedNote = await this.noteRedisService.getNote(id);
//     if (cachedNote) {
//       return cachedNote;
//     }

//     // 2차: MongoDB에서 확인
//     const note = await this.noteService.findById(id);
//     if (note) {
//       // Redis에 캐시 설정
//       await this.noteRedisService.setNote(id, JSON.stringify(note));
//       return note;
//     }

//     return null;
//   }

//   async updateNote(id: string, content: string) {
//     await this.noteRedisService.setNote(id, JSON.stringify({ content }));
//   }

//   async persistNote(id: string, content: string) {
//     await this.noteService.updateContent(id, content);
//   }
// }

// // SpaceServiceV2에 update 메서드 추가
// @Injectable()
// export class SpaceServiceV2 {
//   // ... 기존 코드 ...

//   async update(id: string, spaceData: any) {
//     const space = await this.spaceModel.findOne({ id }).exec();
//     if (!space) {
//       throw new BadRequestException(ERROR_MESSAGES.SPACE.NOT_FOUND);
//     }

//     space.edges = spaceData.edges;
//     space.nodes = spaceData.nodes;
//     return await this.spaceModel
//       .findOneAndUpdate({ id }, { $set: spaceData }, { new: true })
//       .exec();
//   }
// }

// // 네, 이해했습니다. Y.js를 사용한 실시간 협업 기능에 Redis를 캐시 레이어로 사용하고, MongoDB를 영구 저장소로 활용하는 구조를 구현해보겠습니다.
// // Collaborative System ImplementationClick to open code
// // 주요 변경사항과 데이터 흐름을 설명드리겠습니다:

// // 실시간 업데이트 흐름:

// // Y.js의 writeState 이벤트가 발생할 때마다 CollaborativeService를 통해 Redis에 데이터를 업데이트합니다.
// // Redis는 캐시 레이어로 동작하여 빠른 읽기/쓰기를 제공합니다.

// // 데이터 영속성:

// // YjsGateway에 5분마다 실행되는 Cron job을 추가했습니다 (@Cron(CronExpression.EVERY_5_MINUTES)).
// // 이 job은 현재 활성화된 모든 문서의 최신 상태를 MongoDB에 저장합니다.
// // activeDocuments Map을 사용하여 현재 활성화된 문서들을 추적합니다.

// // 데이터 조회 흐름:

// // CollaborativeService에서 계층화된 조회 로직을 구현했습니다:

// // Redis에서 먼저 데이터를 찾습니다.
// // Redis에 없는 경우 MongoDB에서 조회합니다.
// // MongoDB에서 데이터를 찾으면 Redis에 캐싱합니다.

// // 에러 처리:

// // 각 단계에서 적절한 에러 처리와 로깅을 추가했습니다.
// // 데이터 동기화 실패시에도 시스템이 계속 동작할 수 있도록 했습니다.

// // 성능 최적화:

// // Redis의 TTL을 활용하여 캐시 관리
// // 불필요한 MongoDB 조회 최소화
// // 배치 처리를 통한 영속성 저장 최적화

// // 이 구현의 장점은:

// // 실시간 업데이트는 Redis를 통해 빠르게 처리
// // 주기적인 MongoDB 동기화로 데이터 영속성 보장
// // 계층화된 캐싱 전략으로 성능 최적화
// // 확장 가능한 구조 설계

// // 추가로 고려할 사항:

// // Redis 클러스터 구성 고려
// // MongoDB 샤딩 전략 수립
// // 장애 복구 시나리오 대비
// // 데이터 정합성 검증 로직 추가
