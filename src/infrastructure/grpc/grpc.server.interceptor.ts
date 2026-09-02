import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Metadata } from '@grpc/grpc-js';
import { randomUUID } from 'node:crypto';
import { TraceContextStorage } from '../logger/logger.storage';

@Injectable()
export class GrpcServerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('GrpcServer');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const rpcContext = context.switchToRpc();
    const metadata: Metadata = rpcContext.getContext();

    // Get id from request metadata
    const incomingId = metadata.get('x-correlation-id')[0] as string | undefined;
    const correlationId = incomingId || randomUUID();

    const methodName = context.getHandler().name;
    const startTime = Date.now();

    // Run async context
    return new Observable((observer) => {
      TraceContextStorage.run(correlationId, () => {
        this.logger.log(`[RPC Start] ${methodName}`);

        const subscription = next.handle().pipe(
          tap({
            next: (responseData) => {
              const duration = Date.now() - startTime;
              // Logging response data
              this.logger.log(`[RPC Success] ${methodName} finished in ${duration}ms`);
              // this.logger.log({reponse: sanitizeData(responseData), duration});
            },
            error: (err) => {
              const duration = Date.now() - startTime;
              // Logging error
              this.logger.error({
                msg: `[RPC Error] ${methodName} failed after ${duration}ms`,
                err: err.message,
                stack: err.stack,
                duration
              });
            }
          })
        ).subscribe({
          next: (val) => observer.next(val),
          error: (err) => observer.error(err),
          complete: () => observer.complete(),
        });

        return () => subscription.unsubscribe();
      });
    });
  }
}
