export type AppNamedConfig = {
  name: string;
  auth: boolean;
  logLevel: 'debug' | 'verbose' | 'log' | 'warn' | 'error';
  accessExpires: string;
  refreshExpires: string;
  synchronize: boolean;
};

export const appConfigs: AppNamedConfig[] = [
  {
    name: 'dev',
    auth: true,
    logLevel: 'debug',
    accessExpires: '1m',
    refreshExpires: '7d',
    synchronize: true,
  },
  {
    name: 'prod',
    auth: true,
    logLevel: 'warn',
    accessExpires: '15m',
    refreshExpires: '7d',
    synchronize: false,
  },
  {
    name: 'testing',
    auth: false,
    logLevel: 'log',
    accessExpires: '15m',
    refreshExpires: '7d',
    synchronize: true,
  },
];
