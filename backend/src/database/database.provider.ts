import mongoose, { Mongoose } from 'mongoose';
import { AppConfig } from '../config/app.config.provider';

export const databaseProvider = {
  provide: 'DATABASE_CONNECTION',
  useFactory: async (config: AppConfig): Promise<Mongoose> => {
    console.log('Connection MongoDb...');

    await mongoose.connect(config.database.url);
    console.log('Connected MongoDb...');
    return mongoose;
  },

  inject: ['CONFIG'],
};
