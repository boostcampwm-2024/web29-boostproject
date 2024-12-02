import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { Space as SpaceEntity } from './space.test.entity';
import { Note as NoteEntity } from './note.test.entity';
import { SpaceDocument, SpaceSchema } from 'src/space/space.schema';
import { NoteDocument, NoteSchema } from 'src/note/note.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceEntity, NoteEntity]),
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
