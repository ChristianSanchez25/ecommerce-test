import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;
  STAGE: string;
  VERSION: string;
  SEED: boolean;
  DB_NAME: string;
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: number;
  DB_HOST: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),
    STAGE: joi.string().required(),
    VERSION: joi.string().required(),
    SEED: joi.boolean().required(),
    DB_NAME: joi.string().required(),
    DB_PASS: joi.string().required(),
    DB_USER: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_HOST: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_EXPIRES_IN: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate({
  ...process.env,
});

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

export const envs = {
  port: envVars.PORT,
  stage: envVars.STAGE,
  version: envVars.VERSION,
  seed: envVars.SEED,
  mongo: {
    auth: {
      name: envVars.DB_NAME,
      pass: envVars.DB_PASS,
      user: envVars.DB_USER,
      port: envVars.DB_PORT,
      host: envVars.DB_HOST,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    expiresIn: envVars.JWT_EXPIRES_IN,
  },
};
