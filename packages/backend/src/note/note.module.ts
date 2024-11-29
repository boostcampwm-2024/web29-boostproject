import { Module } from '@nestjs/common';
import { NoteController } from './note.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { NoteRedisService } from './note.redis.service';
import {
  NoteDocument,
  NoteSchema,
} from 'src/collaborative/schemas/note.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'src/common/logger/logger.module';
import { NoteService } from './note.service';

@Module({
  imports: [
    LoggerModule,
    MongooseModule.forFeature([
      { name: NoteDocument.name, schema: NoteSchema },
    ]),
  ],
  providers: [NoteService, SnowflakeService, NoteRedisService],
  controllers: [NoteController],
  exports: [NoteService, NoteRedisService],
})
export class NoteModule {}
