import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Space } from './schema/space.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
}
