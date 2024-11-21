import { Module } from '@nestjs/common';
import { YjsGateway } from './yjs.gateway';
import { SpaceModule } from 'src/space/space.module';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [SpaceModule, NoteModule],
  providers: [YjsGateway],
})
export class YjsModule {}
