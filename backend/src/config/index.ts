import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'very-secret-secret',
    expires_in: process.env.JWT_EXPIRES_IN || '1d',
    refresh_secret: process.env.JWT_REFRESH_SECRET || 'very-secret-refresh-secret',
    refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
};
