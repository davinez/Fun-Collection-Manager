import { tracerSetup } from './shared/opentelemetry/tracer';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import validationOptions from './shared/utils/validation.options';
import {
  ValidationPipe,
} from '@nestjs/common';
import { AllExceptionsFilter } from './shared/filters/all.filter';
import { CustomLoggerService } from './shared/logging/customlogger.service';

async function bootstrap() {
  // Open Telemetry Trace, only works if runs before app create
  // And because is executed before app created, we dont have acces to the config service / loading of env variables through NestJS
  // await tracerSetup(process.env.OPENTELEMETRY__OTELCOLLECTORURL as string);

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger: new CustomLoggerService()
  });
  
  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Manager Support')
    .setDescription('API for support utilities of Manager API')
    .setVersion('1.0')
    .addTag('managersupport')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  app.useGlobalFilters(new AllExceptionsFilter());

  // Validation
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  await app.listen(8082);
}
bootstrap();
