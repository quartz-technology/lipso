import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PositionsModule } from './positions/positions.module';

@Module({
  imports: [PositionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
