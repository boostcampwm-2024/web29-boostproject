import { Module } from '@nestjs/common';
import { NoteModule } from 'src/note/note.module';
import { SpaceModule } from 'src/space/space.module';
import { CollaborativeService } from './collaborative.service';
import { CollaborativeController } from './collaborative.controller';

@Module({
  imports: [NoteModule, SpaceModule],
  providers: [CollaborativeService],
  exports: [CollaborativeService],
  controllers: [CollaborativeController],
})
export class CollaborativeModule {}
