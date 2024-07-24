
import { tracerSetup } from './shared/opentelemetry/tracer';
//const { tracer } = require('./shared/openetelemetry/tracer');

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import validationOptions from './shared/utils/validation-options';
import {
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all.filter';
import { ConfigService } from '@nestjs/config';
import { ManagerSupportException } from './shared/exceptions/manager.support.exception';
import { CustomLoggerService } from './shared/logging/customlogger.service';
import { LoggerService, Logger } from '@nestjs/common';

async function bootstrap() {
  // Open Telemetry Trace, only works if runs before app create
  // And because is executed before app created, we dont have acces to the config service / loading of env variables through NestJS
  const otelCollectorUrl = process.env.OPENTELEMETRY__OTELCOLLECTORURL;
  await tracerSetup(otelCollectorUrl && otelCollectorUrl.length > 0 ? otelCollectorUrl : 'http://localhost:4318');

  const app = await NestFactory.create(AppModule, {
    //logger: ['log','fatal','error', 'warn'],
    bufferLogs: true,
    logger: new CustomLoggerService()
  });
  
  // const logger = app.get(CustomLoggerService);
  // app.useLogger(logger);

  //const configService = app.get(ConfigService);

  // Open Telemetry
  //const otelCollectorUrl = configService.get<string>('OPENTELEMETRY__OTELCOLLECTORURL');

  // if (otelCollectorUrl === undefined)
  //   throw new ManagerSupportException("Env Variable OPENTELEMETRY__OTELCOLLECTORURL undefined");

  // await tracerSetup(otelCollectorUrl);

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Manager Support')
    .setDescription('API for support utilities of Manager API')
    .setVersion('1.0')
    .addTag('managersupport')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // resolve LogService
  //const loggerService = await app.get(Logger);
 // const logService = app.get<CustomLoggerService>(CustomLoggerService);

  app.useGlobalFilters(new AllExceptionsFilter());

  // Validation
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(8082);
}
bootstrap();
