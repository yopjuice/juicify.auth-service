import { InterceptingCall } from '@grpc/grpc-js';
import { TraceContextStorage } from '../logger/logger.storage';

export const grpcClientInterceptor = (options: any, nextCall: any) => {
  return new InterceptingCall(nextCall(options), {
    start: (metadata, listener, next) => {
      const correlationId = TraceContextStorage.getCorrelationId();
      if (correlationId) {
        // Inject correlation id into our request metadata
        metadata.set('x-correlation-id', correlationId);
      }
      next(metadata, listener);
    },
  });
};
