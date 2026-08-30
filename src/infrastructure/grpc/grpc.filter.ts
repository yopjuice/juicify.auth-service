import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { status } from '@grpc/grpc-js';
import { DomainError } from '../../shared/errors/domain-errors';
import * as errors from '../../shared/errors/domain-errors';
import {
  IncomingGrpcError,
  IncomingHttpError,
} from '../../shared/errors/incoming-error.interface';
import { Logger } from '@nestjs/common';

@Catch()
export class GlobalGrpcExceptionFilter implements RpcExceptionFilter {

  private readonly logger = new Logger(GlobalGrpcExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): Observable<any> {
    let code = status.INTERNAL;
    let details: string = 'No details';

    // Define error type
    const errorType = this.resolveErrorType(exception);

    switch (errorType) {
      case 'domain': {
        // We are sure that it's a DomainError
        const domainErr = exception as DomainError;

        if (domainErr instanceof errors.EntityNotFoundError)
          code = status.NOT_FOUND;
        else if (domainErr instanceof errors.EntityAlreadyExistsError)
          code = status.ALREADY_EXISTS;
        else if (domainErr instanceof errors.InvalidArgumentError)
          code = status.INVALID_ARGUMENT;
        else if (domainErr instanceof errors.UnauthenticatedError)
          code = status.UNAUTHENTICATED;
        else if (domainErr instanceof errors.PermissionDeniedError)
          code = status.PERMISSION_DENIED;
        details = domainErr.message;
        break;
      }

      case 'grpc': {
        const grpcError = exception as IncomingGrpcError;
        code = grpcError.code;
        details = grpcError.details;
        break;
      }

      case 'http': {
        const httpError = exception as IncomingHttpError;
        code = status.INTERNAL; // TODO: map error code
        details = `[Category service]: ${httpError.message}`;
        break;
      }

      case 'system':
      default: {
        // Critical erroor
        if (exception instanceof Error) {
          this.logger.error('[Critical system error]:', exception);
          details = exception.message;
        }
        break;
      }
    }

    return throwError(() => ({ code, details }));
  }

  // Smart error type detector
  private resolveErrorType(
    exception: any,
  ): 'domain' | 'grpc' | 'http' | 'system' {
    if (!exception) return 'system';

    // Our domain errors
    if (exception.type === 'domain' || exception instanceof DomainError) {
      return 'domain';
    }

    // gRPC error
    if (typeof exception.code === 'number' && 'details' in exception) {
      return 'grpc';
    }

    // HTTP error
    if ('message' in exception && 'status' in exception) {
      return 'http';
    }
    // Else it's a system error
    return 'system';
  }
}
