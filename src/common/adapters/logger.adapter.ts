import { Injectable, Logger } from '@nestjs/common';
import { envs } from '../../config';
import { ILogger } from '../interfaces/logger.interface';

@Injectable()
export class LoggerAdapter extends Logger implements ILogger {
  async debug(context: string, message: string) {
    if (envs.stage !== 'prod') {
      super.debug(`[DEBUG] ${message}`, context);
    }
  }

  async log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context);
  }

  async error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context);
  }

  async warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context);
  }

  async verbose(context: string, message: string) {
    if (process.env.STAGE !== 'prod') {
      super.verbose(`[VERBOSE] ${message}`, context);
    }
  }
}
