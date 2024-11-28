import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note } from './note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { NoteServiceV2 } from './note.serviceV2';
import { NoteRedisService } from './note.redis.service';
import {
  NoteDocument,
  NoteSchema,
} from 'src/collaborative/schemas/note.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([Note]),
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  providers: [NoteService, SnowflakeService, NoteServiceV2, NoteRedisService],
  controllers: [NoteController],
  exports: [NoteService, NoteServiceV2, NoteRedisService],
})
export class NoteModule {}
