import { Controller, Get, Logger } from '@nestjs/common';
import { TestService } from './test.service';
import { spaceMockData } from './mock/space.mock.data';
import { noteMockData } from './mock/note.mock.data';

interface PerformanceResult {
  mysqlDuration: number;
  mongoDuration: number;
  difference: number;
}

@Controller('test')
export class TestController {
  private readonly logger = new Logger(TestController.name);

  constructor(private readonly testService: TestService) {}

  @Get('read/space')
  async testSpaceReadPerformance() {
    this.logger.log('Testing read performance for Space.');
    const iterations = 1000;

    const mysqlStartTime = process.hrtime();
    for (let i = 0; i < iterations; i++) {
      await this.testService.findSpaceByIdSQL(spaceMockData[0].id);
    }
    const mysqlEndTime = process.hrtime(mysqlStartTime);
    const mysqlDuration = (mysqlEndTime[0] * 1e9 + mysqlEndTime[1]) / 1e6;

    const mongoStartTime = process.hrtime();

    for (let i = 0; i < iterations; i++) {
      await this.testService.findSpaceByIdMongo(spaceMockData[0].id);
    }

    const mongoEndTime = process.hrtime(mongoStartTime);
    const mongoDuration = (mongoEndTime[0] * 1e9 + mongoEndTime[1]) / 1e6;

    this.logger.log('Read performance test for Space completed.', {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    });

    return {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    };
  }

  @Get('read/note')
  async testNoteReadPerformance() {
    this.logger.log('Testing read performance for Note.');
    const iterations = 1000;

    const mysqlStartTime = process.hrtime();
    for (let i = 0; i < iterations; i++) {
      await this.testService.findNoteByIdSQL(noteMockData[0].id);
    }
    const mysqlEndTime = process.hrtime(mysqlStartTime);
    const mysqlDuration = (mysqlEndTime[0] * 1e9 + mysqlEndTime[1]) / 1e6;

    const mongoStartTime = process.hrtime();
    for (let i = 0; i < iterations; i++) {
      await this.testService.findNoteByIdMongo(noteMockData[0].id);
    }
    const mongoEndTime = process.hrtime(mongoStartTime);
    const mongoDuration = (mongoEndTime[0] * 1e9 + mongoEndTime[1]) / 1e6;

    this.logger.log('Read performance test for Note completed.', {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    });

    return {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    };
  }

  @Get('write/space')
  async testSpaceWritePerformance() {
    this.logger.log('Testing write performance for Space.');
    const iterations = 1000;
    const testData = Array(iterations)
      .fill(null)
      .map((_, index) => ({
        ...spaceMockData[0],
        id: `test-space-${index}`,
      }));

    const mysqlStartTime = process.hrtime();
    for (const data of testData) {
      await this.testService.createSpaceSQL(data);
    }
    const mysqlEndTime = process.hrtime(mysqlStartTime);
    const mysqlDuration = (mysqlEndTime[0] * 1e9 + mysqlEndTime[1]) / 1e6;

    const mongoStartTime = process.hrtime();
    for (const data of testData) {
      await this.testService.createSpaceMongo(data);
    }
    const mongoEndTime = process.hrtime(mongoStartTime);
    const mongoDuration = (mongoEndTime[0] * 1e9 + mongoEndTime[1]) / 1e6;

    this.logger.log('Write performance test for Space completed.', {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    });

    return {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    };
  }

  @Get('write/note')
  async testNoteWritePerformance() {
    this.logger.log('Testing write performance for Note.');
    const iterations = 1000;
    const testData = Array(iterations)
      .fill(null)
      .map((_, index) => ({
        ...noteMockData[0],
        id: `test-note-${index}`,
      }));

    const mysqlStartTime = process.hrtime();
    for (const data of testData) {
      await this.testService.createNoteSQL(data);
    }
    const mysqlEndTime = process.hrtime(mysqlStartTime);
    const mysqlDuration = (mysqlEndTime[0] * 1e9 + mysqlEndTime[1]) / 1e6;

    const mongoStartTime = process.hrtime();
    for (const data of testData) {
      await this.testService.createNoteMongo(data);
    }
    const mongoEndTime = process.hrtime(mongoStartTime);
    const mongoDuration = (mongoEndTime[0] * 1e9 + mongoEndTime[1]) / 1e6;

    this.logger.log('Write performance test for Note completed.', {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    });

    return {
      mysqlDuration,
      mongoDuration,
      difference: Math.abs(mysqlDuration - mongoDuration),
    };
  }
}
