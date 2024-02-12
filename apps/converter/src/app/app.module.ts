import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { GenerateService } from './generate.service';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
  ],
  controllers: [AppController],
  providers: [GenerateService],
})
export class AppModule {}
