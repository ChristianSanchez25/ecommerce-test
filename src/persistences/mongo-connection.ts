import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { envs } from '../config';

export const mongoConnection: MongooseModuleAsyncOptions = {
  useFactory: () => ({
    uri: `mongodb://${envs.mongo.auth.host}:${envs.mongo.auth.port}`,
    dbName: envs.mongo.auth.name,
    user: envs.mongo.auth.user,
    pass: envs.mongo.auth.pass,
  }),
};
