import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL, BOOKS_GRPC_URL } = process.env;

export default registerAs('mainConfig', () => ({
  DATABASE_URL,
  BOOKS_GRPC_URL: BOOKS_GRPC_URL || '0.0.0.0:2066',
}));
