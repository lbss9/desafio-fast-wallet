import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppLogger } from './utils/app-logger/app-logger.util';

export async function setupApplication(
  app: INestApplication,
  configService: ConfigService,
  logger: AppLogger,
): Promise<void> {
  const environment = configService.getOrThrow<string>('STAGE');
  const appName = configService.getOrThrow<string>('APP_NAME');

  logger.setContext('ApplicationSetup');
  logger.log('Configuring application', {
    appName,
    environment,
  });

  await setupSecurity(app, configService, logger, environment);
  await setupPerformance(app, logger);
  await setupValidation(app, environment);
  await setupVersioning(app);
  await setupDocumentation(app, environment, appName);

  logger.log('Application configuration completed', {
    features: {
      cors: environment !== 'prod' ? 'development' : 'restricted',
      compression: true,
      validation: 'global',
      versioning: 'uri-v1',
      swagger: environment !== 'prod',
      helmet: true,
      gracefulShutdown: true,
    },
    globalPrefix: 'api',
    defaultVersion: '1',
  });
}

async function setupSecurity(
  app: INestApplication,
  configService: ConfigService,
  logger: AppLogger,
  environment: string,
): Promise<void> {
  logger.setContext('SecuritySetup');
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy:
        environment === 'prod'
          ? {
              directives: {
                defaultSrc: [`'self'`],
                styleSrc: [`'self'`, `'unsafe-inline'`],
                imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
                scriptSrc: [`'self'`, `'unsafe-inline'`],
              },
            }
          : false,
    }),
  );

  const corsOrigins =
    environment === 'prod'
      ? configService.getOrThrow<string>('ALLOWED_ORIGINS')?.split(',') || []
      : true;

  app.enableCors({
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  logger.log('Security configured', {
    environment,
    origins: corsOrigins === true ? 'all' : corsOrigins,
  });
}

async function setupPerformance(
  app: INestApplication,
  logger: AppLogger,
): Promise<void> {
  logger.setContext('PerformanceSetup');
  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res);
      },
    }),
  );

  logger.log('Performance optimizations applied', {
    compression: true,
    helmet: true,
  });
}

async function setupValidation(
  app: INestApplication,
  environment: string,
): Promise<void> {
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: environment === 'prod',
    }),
  );
}

async function setupVersioning(app: INestApplication): Promise<void> {
  app.enableVersioning({
    type: VersioningType.URI,
    prefix: 'v',
    defaultVersion: '1',
  });

  app.setGlobalPrefix('api', {
    exclude: ['/health', '/metrics', '/docs'],
  });
}

async function setupDocumentation(
  app: INestApplication,
  environment: string,
  appName: string,
): Promise<void> {
  if (environment !== 'prod') {
    const config = new DocumentBuilder()
      .setTitle(appName)
      .setDescription(`API REST do ${appName}`)
      .setVersion('1.0.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'JWT',
          description: 'Enter JWT token',
          in: 'header',
        },
        'JWT-auth',
      )
      .addServer('http://localhost:3000', 'Desenvolvimento')
      .addTag('Auth', 'Endpoints de autenticação')
      .addTag('Users', 'Gerenciamento de usuários')
      .build();

    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, {
        include: [],
        deepScanRoutes: true,
      });

    SwaggerModule.setup('docs', app, documentFactory, {
      jsonDocumentUrl: 'docs/json',
      swaggerOptions: {
        persistAuthorization: true,
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
      },
      customSiteTitle: `${appName} - API Docs`,
    });

    console.log('Swagger documentation configured', {
      path: '/docs',
    });
  }
}
