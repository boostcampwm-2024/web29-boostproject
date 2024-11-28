import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LoggerService } from '../logger/logger.service';
import { join } from 'path';

export const getTypeOrmConfig = async (
  configService: ConfigService,
  logger: LoggerService,
): Promise<TypeOrmModuleOptions> => {
  const host = configService.get<string>('MYSQL_HOST');
  const port = configService.get<number>('MYSQL_PORT');
  const database = configService.get<string>('MYSQL_DATABASE');
  logger.info('Initializing MySQL connection', {
    module: 'AppModule',
    host,
    port,
    database,
  });
  return {
    type: 'mysql',
    host,
    port,
    username: configService.get<string>('MYSQL_USER'),
    password: configService.get<string>('MYSQL_PASSWORD'),
    database,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    logging: true,
  };
};
