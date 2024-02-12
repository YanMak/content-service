import { Module } from '@nestjs/common';

import { AppService } from './app.service';

import { ConfigModule } from '@nestjs/config';
import { RMQModule } from 'nestjs-rmq';
//import { ServeStaticModule } from '@nestjs/serve-static';
import { getRMQConfig } from './configs/rmq.config';
import { path } from 'app-root-path';
import { ApiController } from './api.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: 'envs/.env', isGlobal: true }),
    RMQModule.forRootAsync(getRMQConfig()),
    //ServeStaticModule.forRoot({
    //  rootPath: `${path}/uploads`,
    //  serveRoot: '/uploads',
    //}),
  ],
  controllers: [ApiController],
  providers: [FilesService],
})
export class AppModule {}
