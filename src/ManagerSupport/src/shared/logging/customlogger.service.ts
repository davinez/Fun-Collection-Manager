import { LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';

// NOT IN USE 
export class CustomLoggerService implements LoggerService {
  private logger: LoggerService;

  constructor() {
    this.logger = WinstonModule.createLogger({
      level: 'log',
      transports: [
        // Not working with grafana cloud, only in loki selfhosted
        //   new LokiTransport({
        //   host: process.env.LOKI__COLLECTORURL as string,
        //   labels: { 'service_name': 'ManagerSupportWebApi' },
        //   json: true,
        //   format: winston.format.json(),
        //   replaceTimestamp: true,
        //   onConnectionError: (err) => console.log("Error " + err),
        // }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          )
        })
      ],
    });
  }

  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    this.logger.log(message, optionalParams);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    if (this.logger.fatal)
      this.logger.fatal(message, optionalParams);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, optionalParams);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, optionalParams);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    if (this.logger.debug)
      this.logger.debug(message, optionalParams);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    if (this.logger.verbose)
      this.logger.verbose(message, optionalParams);
  }

}