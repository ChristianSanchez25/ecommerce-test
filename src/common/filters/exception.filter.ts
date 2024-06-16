import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { LOGGER_SERVICE } from '../constants/common.constants';
import { IError } from '../interfaces/error.interface';
import { ILogger } from '../interfaces/logger.interface';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(@Inject(LOGGER_SERVICE) private readonly logger: ILogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const exceptionMessage =
      exception instanceof HttpException
        ? (exception.getResponse() as IError)
        : { message: (exception as Error).message, code_error: null };

    const responseData: IError = {
      ...{
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      ...exceptionMessage,
    };

    this.logException(
      request,
      exceptionMessage.message,
      exceptionMessage.code_error,
      status,
      exception,
    );

    response.status(status).json(responseData);
  }

  private logException(
    request: any,
    message: string,
    code_error: string,
    status: number,
    exception: any,
  ) {
    if (status === 500) {
      this.logger.error(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${
          code_error ? code_error : null
        } message=${message ? message : null}`,
        status >= 500 ? exception.stack : '',
      );
    } else {
      this.logger.warn(
        `End Request for ${request.path}`,
        `method=${request.method} status=${status} code_error=${
          code_error ? code_error : null
        } message=${message ? message : null}`,
      );
    }
  }
}
