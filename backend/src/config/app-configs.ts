export type AppNamedConfig = {
  name: string;
  auth: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  accessExpires: string;
  refreshExpires: string;
  synchronize: boolean;
};

export const appConfigs: AppNamedConfig[] = [
  {
    name: 'dev',
    auth: true,
    logLevel: 'debug',
    accessExpires: '15m',
    refreshExpires: '7d',
    synchronize: true,
  },
  {
    name: 'prod',
    auth: true,
    logLevel: 'warn',
    accessExpires: '15m',
    refreshExpires: '7d',
    synchronize: true,
  },
  {
    name: 'testing',
    auth: false,
    logLevel: 'info',
    accessExpires: '15m',
    refreshExpires: '7d',
    synchronize: true,
  },
];
