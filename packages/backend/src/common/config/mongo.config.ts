import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { LoggerService } from '../logger/logger.service';

export const getMongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const host = configService.get<string>('MONGO_HOST');
  const user = configService.get<string>('MONGO_USER');
  const pass = configService.get<string>('MONGO_PASSWORD');
  const dbName = configService.get<string>('MONGO_DB');
  const uri = `mongodb://${user}:${pass}@${host}:27017/${dbName}`;

  return {
    uri,
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-256',
    connectionFactory: (connection) => {
      return connection;
    },
  };
};
