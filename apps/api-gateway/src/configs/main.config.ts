import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const { APP_HOST, APP_PORT, NODE_ENV, GLOBAL_PREFIX, AUTH_GRPC_URL } =
  process.env;

export default registerAs('mainConfig', () => ({
  host: APP_HOST || 'localhost',
  port: +APP_PORT || 2065,
  nodeEnv: NODE_ENV || 'development',
  globalPrefix: GLOBAL_PREFIX || 'api',
  authGrpcUrl: AUTH_GRPC_URL || '0.0.0.0:2064',
}));
