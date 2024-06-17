import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LOGGER_SERVICE } from '../constants/common.constants';
import { ErrorDto } from '../dtos/error.dto';
import { ILogger } from '../interfaces/logger.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: ILogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let responseMessage: any;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      responseMessage = exception.getResponse();
    } else {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      responseMessage = {
        message: (exception as Error).message,
        code_error: 'INTERNAL_SERVER_ERROR',
      };
    }

    const responseData: ErrorDto = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: responseMessage.message || 'Internal server error',
      code_error: responseMessage.error || 'INTERNAL_SERVER_ERROR',
    };

    this.logException(request, responseData);

    response.status(status).json(responseData);
  }

  private logException(request: Request, errorData: ErrorDto) {
    const { method, url } = request;
    const { statusCode, message, code_error } = errorData;

    if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `End Request for ${url}`,
        `method=${method} status=${statusCode} code_error=${code_error} message=${message}`,
      );
    } else {
      this.logger.warn(
        `End Request for ${url}`,
        `method=${method} status=${statusCode} code_error=${code_error} message=${message}`,
      );
    }
  }
}
