import {
  HttpStatus,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { ValidationException } from '../exceptions/validation.exception';


const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) => {
    return new ValidationException(
      errors.map(e => {
        return {
          domain: e.property,
          error: e.children?.toString()
        }
      })
    );
  },
};

export default validationOptions;