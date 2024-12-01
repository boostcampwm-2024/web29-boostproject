import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteDocument, NoteSchema } from 'src/note/note.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteService } from './note.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  providers: [NoteService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}
