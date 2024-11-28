import { Module } from '@nestjs/common';
import { YjsGateway } from './yjs.gateway';
import { SpaceModule } from 'src/space/space.module';
import { NoteModule } from 'src/note/note.module';
import { YjsGatewayV2 } from './yjs.gateway.v2';
import { CollaborativeModule } from 'src/collaborative/collaborative.module';

@Module({
  imports: [SpaceModule, NoteModule, CollaborativeModule],
  providers: [YjsGateway, YjsGatewayV2],
})
export class YjsModule {}
