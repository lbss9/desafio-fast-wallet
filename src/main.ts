import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApplication } from './main.setup';
import { AppLogger } from './utils/app-logger/app-logger.util';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(AppLogger));
  const logger = app.get(AppLogger);
  logger.setContext('Bootstrap');

  const configService = app.get(ConfigService);

  const port = configService.getOrThrow<number>('PORT');
  const environment = configService.getOrThrow<string>('STAGE');
  const appName = configService.getOrThrow<string>('APP_NAME');

  logger.log('Application starting', {
    appName,
    environment,
    port,
  });

  await setupApplication(app, configService, logger);

  await app.listen(port, '0.0.0.0');

  logger.log('Server started successfully', {
    port,
    host: '0.0.0.0',
    environment,
    version: process.env.npm_package_version,
    urls: {
      server: `http://localhost:${port}`,
      health: `http://localhost:${port}/health`,
      docs: environment !== 'prod' ? `http://localhost:${port}/docs` : null,
    },
  });
}

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection', {
    reason: reason instanceof Error ? reason.message : reason,
    stack: reason instanceof Error ? reason.stack : undefined,
    promise: promise.toString(),
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception', {
    message: error.message,
    stack: error.stack,
    name: error.name,
    timestamp: new Date().toISOString(),
  });
  process.exit(1);
});

bootstrap();
