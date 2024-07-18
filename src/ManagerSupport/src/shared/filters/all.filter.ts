import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';
import { ManagerSupportException } from '../exceptions/manager.support.exception';
import { ApiErrorResponseDto } from '../dto/api-error-response.dto';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: ApiErrorResponseDto | undefined = undefined;

    if (exception instanceof ValidationException) {
      responseBody = {
        apiVersion: "1.0",
        error: {
          code: httpStatus,
          message: "Validation Problem. https://tools.ietf.org/html/rfc7231#section-6.5.1",
          errors: exception.errors
        }
      };
    } else if (exception instanceof ManagerSupportException) {
      responseBody = {
        apiVersion: "1.0",
        error: {
          code: httpStatus,
          message: "Validation Problem. https://tools.ietf.org/html/rfc7231#section-6.5.1",
          errors: [
            {
              domain: typeof exception.cause === "string" ? exception.cause : "ManagerSupportException",
              reason: "https://tools.ietf.org/html/rfc7231#section-6.5.8",
              message: exception.message
            }
          ]
        }
      };
    } else if (exception instanceof HttpException) {
      responseBody = {
        apiVersion: "1.0",
        error: {
          code: httpStatus,
          message: "General HttpException",
          errors: [
            {
              domain: "ManagerSupport General HttpException",
              reason: "",
              message: exception.message
            }
          ]
        }
      };
    } else {
      responseBody = {
        apiVersion: "1.0",
        error: {
          code: httpStatus,
          message: "Unhandled Exception",
          errors: [
            {
              domain: "ManagerSupport Unhandled HttpException",
              reason: "",
              message: ""
            }
          ]
        }
      };
    }

    response.status(httpStatus).json(responseBody);
  }
}