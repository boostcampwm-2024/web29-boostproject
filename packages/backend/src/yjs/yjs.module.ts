import { Module } from '@nestjs/common';
import { SpaceModule } from 'src/space/space.module';
import { NoteModule } from 'src/note/note.module';
import { CollaborativeModule } from 'src/collaborative/collaborative.module';
import { YjsGateway } from './yjs.gateway';
@Module({
  imports: [SpaceModule, NoteModule, CollaborativeModule],
  providers: [YjsGateway],
})
export class YjsModule {}
