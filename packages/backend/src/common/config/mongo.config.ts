import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';
import { LoggerService } from '../logger/logger.service';

export const getMongooseConfig = (
  configService: ConfigService,
  logger: LoggerService,
): MongooseModuleOptions => {
  const host = configService.get<string>('MONGO_HOST');
  const user = configService.get<string>('MONGO_USER');
  const pass = configService.get<string>('MONGO_PASSWORD');
  const dbName = configService.get<string>('MONGO_DB');
  const uri = `mongodb://${user}:${pass}@${host}:27017/${dbName}`;

  logger.info('Initializing MongoDB connection', {
    module: 'AppModule',
    database: dbName,
    host: host,
  });

  return {
    uri,
    authSource: 'admin',
    authMechanism: 'SCRAM-SHA-256',
    connectionFactory: (connection) => {
      connection.on('connected', () => {
        logger.info('MongoDB connected successfully', {
          module: 'AppModule',
          database: dbName,
        });
      });
      connection.on('error', (error) => {
        logger.error('MongoDB connection error', {
          module: 'AppModule',
          error: error.message,
          stack: error.stack,
        });
      });
      return connection;
    },
  };
};
