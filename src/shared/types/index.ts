import { Observable } from 'rxjs';

// Transform Observable to Promise
export type GrpcToPromise<T> = {
  [K in keyof T]: T[K] extends (...args: infer A) => Observable<infer R>
    ? (...args: A) => Promise<R>
    : T[K];
};
