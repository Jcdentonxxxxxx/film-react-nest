import { ConfigService } from '@nestjs/config';

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

export interface AppConfigServer {
  port: number;
}

export interface AppConfig {
  database: AppConfigDatabase;
  server: AppConfigServer;
}

export function buildDatabaseConfig(
  configService: ConfigService,
): AppConfigDatabase {
  const url = configService.get<string>('DATABASE_URL');
  if (!url) {
    throw new Error('DATABASE_URL отсутствует');
  }
  return {
    driver: configService.get<string>('DATABASE_DRIVER'),
    url,
  };
}

export function createAppConfig(configService: ConfigService): AppConfig {
  return {
    database: buildDatabaseConfig(configService),
    server: {
      port: Number(configService.get('PORT', 3000)),
    },
  };
}
