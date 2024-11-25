import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { Note } from './note.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnowflakeService } from 'src/common/utils/snowflake.service';

@Module({
  imports: [TypeOrmModule.forFeature([Note])],
  providers: [NoteService, SnowflakeService],
  controllers: [NoteController],
  exports: [NoteService],
})
export class NoteModule {}
