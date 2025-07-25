import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { ConfigService } from '@nestjs/config';

export const createWinstonConfig = (
  configService: ConfigService,
): winston.LoggerOptions => {
  return {
    level: configService.get<string>('logLevel'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      configService.get<string>('name') === 'dev'
        ? winston.format.prettyPrint()
        : winston.format.json(),
    ),
    transports: [
      ...(configService.get<string>('name') === 'dev'
        ? [
            new winston.transports.Console({
              format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstonModuleUtilities.format.nestLike(
                  configService.get<string>('APP_NAME', 'App'),
                  {
                    prettyPrint: true,
                    colors: true,
                  },
                ),
              ),
            }),
          ]
        : []),
      new winston.transports.File({
        filename: configService.get<string>('LOG_ERROR_FILE', 'logs/error.log'),
        level: 'error',
      }),
      new winston.transports.File({
        filename: configService.get<string>(
          'LOG_COMBINED_FILE',
          'logs/combined.log',
        ),
      }),
    ],
  };
};
