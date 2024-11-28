// import {
//   WebSocketGateway,
//   WebSocketServer,
//   OnGatewayConnection,
//   OnGatewayDisconnect,
// } from '@nestjs/websockets';
// import { parseSocketUrl } from 'src/common/utils/socket.util';
// import { WebsocketStatus } from 'src/common/constants/websocket.constants';
// import { Server, WebSocket } from 'ws';
// import { Request } from 'express';
// import {
//   setupWSConnection,
//   setPersistence,
//   setContentInitializor,
// } from 'y-websocket/bin/utils';
// import * as Y from 'yjs';
// import { ERROR_MESSAGES } from 'src/common/constants/error.message.constants';
// import { CollaborativeService } from 'src/collaborative/collaborative.service';
// import { Logger } from '@nestjs/common';
// const SPACE = 'space';

// @WebSocketGateway(9001)
// export class YjsGatewayV2 implements OnGatewayConnection, OnGatewayDisconnect {
//   private readonly logger = new Logger(YjsGatewayV2.name);
//   constructor(private readonly collaborativeService: CollaborativeService) {}

//   @WebSocketServer()
//   server: Server;

//   async handleConnection(connection: WebSocket, request: Request) {
//     try {
//       const url = request.url || '';
//       const { urlType, urlId } = parseSocketUrl(url);
//       this.logger.log(`WebSocket connection attempt - ${urlType}:${urlId}`);

//       if (!this.validateUrl(urlType, urlId)) {
//         this.logger.error(`Invalid WebSocket URL - ${urlType}:${urlId}`);
//         connection.close(
//           WebsocketStatus.POLICY_VIOLATION,
//           ERROR_MESSAGES.SOCKET.INVALID_URL,
//         );
//         return;
//       }
//       urlType === SPACE
//         ? await this.initializeSpace(connection, request, urlId as string)
//         : await this.initializeNote(connection, request, urlId as string);
//     } catch (error) {
//       this.logger.error(`WebSocket connection failed: ${error.message}`);
//     }
//   }

//   handleDisconnect(connection: WebSocket) {
//     this.logger.log('WebSocket disconnected');
//   }

//   private validateUrl(urlType: string | null, urlId: string | null): boolean {
//     if (!urlType || !urlId || (urlType !== 'space' && urlType !== 'note')) {
//       return false;
//     }
//     return true;
//   }

//   private async initializeSpace(
//     connection: WebSocket,
//     request: Request,
//     urlId: string,
//   ) {
//     setPersistence({
//       provider: '',
//       bindState: (docName: string, ydoc: Y.Doc) => {
//         try {
//           const yContext = ydoc.getMap('context');
//           this.logger.log(
//             `Space bindState called for ${JSON.stringify(yContext.toJSON)}`,
//           );
//         } catch (error) {
//           this.logger.error(`Error in space bindState: ${error.message}`);
//         }
//       },
//       writeState: (docName: string, ydoc: Y.Doc) => {
//         try {
//           const yContext = ydoc.getMap('context');
//           this.logger.log(
//             `Space bindState called for ${JSON.stringify(yContext.toJSON)}`,
//           );

//           this.collaborativeService.updateBySpace(
//             urlId,
//             JSON.stringify(yContext),
//           );
//           this.logger.log('Space state updated successfully');
//         } catch (error) {
//           this.logger.error(`Error in space writeState: ${error.message}`);
//         }
//         return Promise.resolve();
//       },
//     });

//     setContentInitializor(async (ydoc) => {
//       try {
//         const space = await this.collaborativeService.findBySpace(urlId);
//         if (!space) {
//           this.logger.error(`Space not found during initialization: ${urlId}`);
//           return;
//         }

//         const parsedSpace = {
//           ...space,
//           edges: JSON.parse(space.edges),
//           nodes: JSON.parse(space.nodes),
//         };

//         this.logger.log('Space content initialization started');
//         this.setYSpace(ydoc, parsedSpace);
//         this.logger.log('Space content initialized successfully');
//       } catch (error) {
//         this.logger.error(`Error initializing space content: ${error.message}`);
//       }
//       return Promise.resolve();
//     });

//     setupWSConnection(connection, request, {
//       docName: urlId,
//     });
//   }

//   private async setYSpace(ydoc: Y.Doc, parsedSpace) {
//     const yContext = ydoc.getMap('context');
//     const yEdges = new Y.Map();
//     const yNodes = new Y.Map();
//     const edges = parsedSpace.edges;
//     const nodes = parsedSpace.nodes;
//     Object.entries(edges).forEach(([edgeId, edge]) => {
//       yEdges.set(edgeId, edge);
//     });
//     Object.entries(nodes).forEach(([nodeId, node]) => {
//       yNodes.set(nodeId, node);
//     });
//     yContext.set('edges', yEdges);
//     yContext.set('nodes', yNodes);
//   }

//   private async initializeNote(
//     connection: WebSocket,
//     request: Request,
//     urlId: string,
//   ) {
//     try {
//       this.logger.log(`Initializing note connection for ${urlId}`);

//       const note = await this.collaborativeService.findByNote(urlId);
//       if (!note) {
//         this.logger.error(`Note not found: ${urlId}`);
//         connection.close(
//           WebsocketStatus.POLICY_VIOLATION,
//           ERROR_MESSAGES.NOTE.NOT_FOUND,
//         );
//         return;
//       }

//       setPersistence({
//         provider: '',
//         bindState: async (docName: string, ydoc: Y.Doc) => {
//           try {
//             if (note.content) {
//               const updates = new Uint8Array(
//                 Buffer.from(note.content, 'base64'),
//               );
//               Y.applyUpdate(ydoc, updates);
//               this.logger.log(`Note state bound successfully for ${docName}`);
//             }
//           } catch (error) {
//             this.logger.error(`Error binding note state: ${error.message}`);
//           }
//         },
//         writeState: async (docName: string, ydoc: Y.Doc) => {
//           try {
//             const updates = Y.encodeStateAsUpdate(ydoc);
//             const encodedUpdates = Buffer.from(updates).toString('base64');
//             await this.collaborativeService.updateByNote(urlId, encodedUpdates);
//             this.logger.log(`Note state updated successfully for ${docName}`);
//           } catch (error) {
//             this.logger.error(`Error writing note state: ${error.message}`);
//           }
//         },
//       });

//       setupWSConnection(connection, request);
//       this.logger.log('Note connection initialized successfully');
//     } catch (error) {
//       this.logger.error(`Error in note initialization: ${error.message}`);
//     }
//   }
// }
