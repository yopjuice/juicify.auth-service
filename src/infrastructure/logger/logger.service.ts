import { Injectable, LoggerService } from '@nestjs/common';
import pino from 'pino';
import { TraceContextStorage } from './logger.storage';

@Injectable()
export class MyLogger implements LoggerService {
  private readonly pinoLogger: pino.Logger;

  constructor() {
    this.pinoLogger = pino({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      // Adding custom context to all logs
      mixin() {
        return { 
          correlationId: TraceContextStorage.getCorrelationId() 
        };
      },
      transport: process.env.NODE_ENV !== 'production' 
        ? { target: 'pino-pretty', options: { colorize: true } } 
        : undefined,
    });
  }

  log(message: any, context?: string) { this.pinoLogger.info({ context }, message); }
  error(message: any, trace?: string, context?: string) { this.pinoLogger.error({ context, err: trace }, message); }
  warn(message: any, context?: string) { this.pinoLogger.warn({ context }, message); }
  debug(message: any, context?: string) { this.pinoLogger.debug({ context }, message); }
}
