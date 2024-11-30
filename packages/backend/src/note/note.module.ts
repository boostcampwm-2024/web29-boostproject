import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { NoteRedisService } from './note.redis.service';
import { NoteDocument, NoteSchema } from 'src/note/note.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { NoteService } from './note.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  providers: [NoteService, NoteRedisService],
  controllers: [NoteController],
  exports: [NoteService, NoteRedisService],
})
export class NoteModule {}
