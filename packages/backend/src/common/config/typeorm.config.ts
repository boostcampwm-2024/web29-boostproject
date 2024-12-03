import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const host = configService.get<string>('MYSQL_HOST');
  const port = configService.get<number>('MYSQL_PORT');
  const database = configService.get<string>('MYSQL_DATABASE');
  const username = configService.get<string>('MYSQL_USER');
  const password = configService.get<string>('MYSQL_PASSWORD');

  return {
    type: 'mysql',
    host,
    port,
    username,
    password,
    database,
    entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
    synchronize: process.env.NODE_ENV !== 'production',
    autoLoadEntities: true,
    logging: true,
  };
};
