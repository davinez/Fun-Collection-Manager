import { HttpException, HttpStatus, } from "@nestjs/common";
import { ApiError } from '../dto/api-error-response.dto';


export class ValidationException extends HttpException {
  constructor(validationsErros: ApiError[]) {
    super('Conflict', HttpStatus.CONFLICT);

    this.errors = validationsErros;
  }

  errors: ApiError[];
}