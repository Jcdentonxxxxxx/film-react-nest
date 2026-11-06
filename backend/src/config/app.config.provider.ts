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
    };
  },
  inject: [ConfigService],
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
