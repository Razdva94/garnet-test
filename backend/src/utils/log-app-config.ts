import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';

export function logAppConfig(config: ConfigService, logger: LoggerService) {
  const nodeEnv = config.get<string>('env');
  const appConfigName = config.get<string>('appConfigName');
  const port = config.get<number>('port');
  const logLevel = config.get<string>('logLevel');
  const auth = config.get<boolean>('auth');
  const enableTokenValidation = config.get<boolean>('enableTokenValidation');
  const synchronize = config.get<string>('synchronize');
  const db = config.get<{
    host: string;
    name: string;
    user: string;
  }>('db');
  const configLogWithEmoji = {
    message: '🟢 Application config:',
    '🌍 Environment': nodeEnv,
    '⚙️ App Config': appConfigName,
    '🪵 Log Level': logLevel,
    '🔐 Auth': auth,
    '🔑 Token Validation': enableTokenValidation,
    '🛢️ DB Host': db?.host,
    '🛢️ DB Name': db?.name,
    '👤 DB User': db?.user,
    '🚪 App Port': port,
    '🗄️ Synchronize': synchronize,
  };
  logger.log(configLogWithEmoji);
}
