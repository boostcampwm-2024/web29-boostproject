import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { SpaceValidationService } from './space.validation.service';
import { SpaceRedisService } from './space.redis.service';
import { SpaceServiceV2 } from './space.serviceV2';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SpaceDocument,
  SpaceSchema,
} from '../collaborative/schemas/space.schema';
import { SpaceValidationServiceV2 } from './space.validation.serviceV2';
import { LoggerModule } from 'src/common/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Space]),
    MongooseModule.forFeature([
      { name: SpaceDocument.name, schema: SpaceSchema },
    ]),
    LoggerModule,
  ],
  controllers: [SpaceController],
  providers: [
    SnowflakeService,
    SpaceService,
    SpaceServiceV2,
    SpaceValidationService,
    SpaceValidationServiceV2,
    SpaceRedisService,
  ],
  exports: [SpaceService, SpaceRedisService, SpaceServiceV2],
})
export class SpaceModule {}
