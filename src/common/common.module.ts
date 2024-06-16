import { Module } from '@nestjs/common';
import { LoggerAdapter } from './adapters/logger.adapter';
import { LOGGER_SERVICE } from './constants/common.constants';

@Module({
  providers: [LoggerAdapter],
  exports: [
    LoggerAdapter,
    {
      provide: LOGGER_SERVICE,
      useClass: LoggerAdapter,
    },
  ],
})
export class CommonModule {}
