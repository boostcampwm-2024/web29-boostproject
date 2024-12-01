import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceController } from './space.controller';
import { SpaceDocument, SpaceSchema } from './space.schema';
import { SpaceValidationService } from './space.validation.service';
import { SpaceService } from './space.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
  ],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceValidationService],
  exports: [SpaceService],
})
export class SpaceModule {}
