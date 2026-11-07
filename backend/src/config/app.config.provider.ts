import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService): AppConfig => {
    const url = configService.get<string>('DATABASE_URL');
    if (!url) {
      throw new Error('DATABASE_URL отсутствует');
    }
    return {
      database: {
        driver: configService.get('DATABASE_DRIVER'),
        url: url,
      },
      server: {
        port: Number(configService.get('PORT', 3000)),
      },
    };
  },
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
  server: AppConfigServer;
}

export interface AppConfigServer {
  port: number;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
