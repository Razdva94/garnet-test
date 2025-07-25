import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const client = createClient({
          url: config.get<{ url: string }>('redis')?.url,
          password: config.get<{ pass: string }>('redis')?.pass,
          socket: {
            tls: false,
            reconnectStrategy: (retries) => Math.min(retries * 100, 3000),
          },
        });

        client.on('error', (err) => console.error('Redis Client Error:', err));

        await client.connect();
        return client;
      },
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisModule {}
