import { tracerSetup } from './shared/opentelemetry/tracer';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import validationOptions from './shared/utils/validation.options';
import {
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all.filter';
import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

async function bootstrap() {
  // Open Telemetry Trace, only works if runs before app create
  // And because is executed before app created, we dont have acces to the config service / loading of env variables through NestJS
  // await tracerSetup(process.env.OPENTELEMETRY__OTELCOLLECTORURL as string);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: WinstonModule.createLogger({
      transports: [
        // to see logs in our console
        new transports.Console({
         format: format.combine(
           format.cli(),
           format.splat(),
           format.timestamp(),
           format.printf((info) => {
             return `${info.timestamp} ${info.level}: ${info.message}`;
           }),
          ),
      }),
      ],
    })
  });
  
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Manager Support')
    .setDescription('API for support utilities of Manager API')
    .setVersion('1.0')
    .addTag('managersupport')
    .addApiKey({type: 'apiKey', name: 'x-api-key', in: 'header'}, 'Api-Key')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  // Validation
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(8082);
}
bootstrap();

