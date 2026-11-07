import { Module } from '@nestjs/common';
import { databaseProvider } from './database.provider';
import { ConfigCustomModule } from '../config/config.module';

@Module({
  imports: [ConfigCustomModule],
  providers: [databaseProvider],
  exports: [databaseProvider],
})
export class DatabaseModule {}
