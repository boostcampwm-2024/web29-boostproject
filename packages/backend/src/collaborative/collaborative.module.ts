import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { SpaceModule } from 'src/space/space.module';
import { CollaborativeService } from './collaborative.service';

@Module({
  imports: [NoteModule, SpaceModule],
  providers: [CollaborativeService],
  exports: [CollaborativeService],
})
export class CollaborativeModule {}
