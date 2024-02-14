import { ConfigModule, ConfigService } from '@nestjs/config';
import { IRMQServiceAsyncOptions } from 'nestjs-rmq';

export const getRMQConfig = (): IRMQServiceAsyncOptions => ({
  inject: [ConfigService],
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    exchangeName: configService.get('AMQP_EXCHANGE_API') ?? '',
    connections: [
      {
        login: configService.get('AMQP_USER_API') ?? '',
        password: configService.get('AMQP_PASSWORD_API') ?? '',
        host: configService.get('AMQP_HOSTNAME_API') ?? '',
        port: 5672,
      },
    ],
    prefetchCount: 32,
    serviceName: 'api',
    messagesTimeout: 100000,
  }),
});
