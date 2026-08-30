import { Module, Global } from '@nestjs/common';
import { DatabaseProvider } from './db.provider';

@Global()
@Module({
  providers: [DatabaseProvider],
  exports: [DatabaseProvider],
})
export class DatabaseModule {}
