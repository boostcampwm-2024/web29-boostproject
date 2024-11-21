import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';

@Injectable()
export class ContentService {
  constructor(private readonly loggerService: LoggerService) {}
}
