import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const {
  APP_HOST,
  APP_PORT,
  NODE_ENV,
  GLOBAL_PREFIX,
  AUTH_GRPC_URL,
  USERS_GRPC_URL,
  BOOKS_GRPC_URL,
} = process.env;

export default registerAs('mainConfig', () => ({
  host: APP_HOST || 'localhost',
  port: +APP_PORT || 2065,
  nodeEnv: NODE_ENV || 'development',
  globalPrefix: GLOBAL_PREFIX || 'api',
  AUTH_GRPC_URL: AUTH_GRPC_URL || '0.0.0.0:8001',
  USERS_GRPC_URL: USERS_GRPC_URL || '0.0.0.0:8002',
  BOOKS_GRPC_URL: BOOKS_GRPC_URL || '0.0.0.0:8003',
}));
