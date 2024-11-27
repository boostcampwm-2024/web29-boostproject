import { Injectable } from '@nestjs/common';
import { Worker } from 'snowflake-uuid';

@Injectable()
export class SnowflakeService {
  private generator: Worker;

  constructor() {
    this.generator = new Worker(0, 1, {
      workerIdBits: 5,
      datacenterIdBits: 5,
      sequenceBits: 12,
    });
  }

  generateId(): string {
    return this.generator.nextId().toString();
  }
}
