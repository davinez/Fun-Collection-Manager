import { HttpException, HttpStatus, } from "@nestjs/common";

export class ManagerSupportException extends HttpException {
  constructor(custoMessage: string) {
    super(custoMessage, HttpStatus.BAD_REQUEST);
  }

}