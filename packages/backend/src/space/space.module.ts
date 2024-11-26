import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { SnowflakeService } from 'src/common/utils/snowflake.service';
import { SpaceValidationService } from './space.validation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Space])],
  controllers: [SpaceController],
  providers: [SpaceService, SpaceValidationService, SnowflakeService],
  exports: [SpaceService],
})
export class SpaceModule {}
