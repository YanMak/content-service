import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { GenerateService } from './generator/generate.service';
import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
import { getRMQConfig } from './configs/rmq.config';
import { S3Service } from './s3/s3.service';
import { CDNService } from './cdn/cdn.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
  ],
  controllers: [AppController],
  providers: [GenerateService, S3Service, CDNService],
})
export class AppModule {}
