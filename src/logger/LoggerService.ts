import { LoggerService, Scope } from '@nestjs/common';
// import * as winston from 'winston';
import { Logger, createLogger, format, transports, config } from 'winston';
import {
  WINSTON_LOGGER_OPTIONS,
  defaultLogFormat,
  fileTransport,
} from './winston-config';
import { Injectable } from '@nestjs/common';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class CustomLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      levels: config.syslog.levels,
      format: format.combine(defaultLogFormat),
      transports: [fileTransport],
    });
    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new transports.Console({
          format: format.simple(),
        }),
      );
    }
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(`ERROR: ${message}`, optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(`WARN: ${message}`, optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.log(`LOG: ${message}`, optionalParams);
  }
}
