import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Space } from './schema/space.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('mongo')
  async mongoSaveTest(@Body() createSpaceDto: Partial<Space>) {
    return await this.appService.mongoSave(createSpaceDto);
  }
  @Get('mongo/:id')
  async mongoFindTest(@Param('id') id: string) {
    return await this.appService.mongoFind(id);
  }
}
