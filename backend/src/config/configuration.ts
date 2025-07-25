import { appConfigs } from './app-configs';

export default () => {
  const selectedName = process.env.APP_CONFIG || 'dev';
  const selectedConfig = appConfigs.find((cfg) => cfg.name === selectedName);

  if (!selectedConfig) {
    throw new Error(`No app config found with name "${selectedName}"`);
  }

  return {
    env: process.env.NODE_ENV,
    appConfigName: selectedName,
    ...selectedConfig,
    refresTokenSecret: process.env.JWT_REFRESH_SECRET,
    acessTokenSecret: process.env.JWT_SECRET,
    nodeEnv: process.env.NODE_ENV,
    db: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432', 10),
      user: process.env.DB_USER,
      pass: process.env.DB_PASS,
      name: process.env.DB_NAME,
    },
    redis: {
      url: process.env.REDIS_URL,
      pass: process.env.REDIS_PASSWORD,
    },
    port: parseInt(process.env.PORT || '3000', 10),
  };
};
