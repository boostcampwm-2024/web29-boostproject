import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SpaceController } from './space.controller';
import { SpaceDocument, SpaceSchema } from './space.schema';
import { SpaceService } from './space.service';
import { SpaceValidation } from './space.validation.service';
import { NoteModule } from 'src/note/note.module';

@Module({
  imports: [
    NoteModule,
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceValidation],
  exports: [SpaceService],
})
export class SpaceModule {}
