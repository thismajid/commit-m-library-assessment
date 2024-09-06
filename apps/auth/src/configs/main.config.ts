import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const { AUTH_GRPC_URL, USERS_GRPC_URL } = process.env;

export default registerAs('mainConfig', () => ({
  AUTH_GRPC_URL: AUTH_GRPC_URL || '0.0.0.0:8001',
  USERS_GRPC_URL: USERS_GRPC_URL || '0.0.0.0:8002',
}));
