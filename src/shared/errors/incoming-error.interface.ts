// // gRPC error
// if (typeof exception.code === 'number' && 'details' in exception) {
//   return 'grpc';
// }
//
// // HTTP error
// if (exception.isAxiosError || ('response' in exception && 'status' in exception)) {
//   return 'http';
// }
//
export interface IncomingGrpcError {
  code: number;
  details: string;
}

export interface IncomingHttpError {
  status: number;
  message: string;
}
