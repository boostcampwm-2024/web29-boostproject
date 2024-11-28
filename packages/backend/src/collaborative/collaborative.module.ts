import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { SpaceModule } from 'src/space/space.module';
import { CollaborativeService } from './collaborative.service';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [NoteModule, SpaceModule],
  providers: [CollaborativeService],
  exports: [CollaborativeService],
})
export class CollaborativeModule {}
