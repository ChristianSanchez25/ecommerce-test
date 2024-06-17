import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseException extends HttpException {
  constructor(message: string, errorCode: string = 'DATABASE_ERROR') {
    super({ message, code_error: errorCode }, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
