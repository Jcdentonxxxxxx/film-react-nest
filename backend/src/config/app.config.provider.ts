import { ConfigService } from '@nestjs/config';
import { createAppConfig } from './app.config.factory';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService) => createAppConfig(configService),
  inject: [ConfigService],
};
