import { Module } from '@nestjs/common';
import { SpaceModule } from 'src/space/space.module';
import { NoteModule } from 'src/note/note.module';
import { CollaborativeModule } from 'src/collaborative/collaborative.module';
// import { YjsGateway } from './yjs.gateway';
import { YjsGatewayV2 } from './yjs.gateway.v2';
@Module({
  imports: [SpaceModule, NoteModule, CollaborativeModule],
  // providers: [YjsGateway],
  providers: [YjsGatewayV2],
})
export class YjsModule {}
