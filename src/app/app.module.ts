import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MyConfigModule } from '../config/config.module';
import { DatabaseModule } from '../infrastructure/db/db.module';

@Module({
  imports: [
    MyConfigModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
