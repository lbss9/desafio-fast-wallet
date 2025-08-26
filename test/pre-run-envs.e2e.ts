import 'reflect-metadata';

process.env.APP_NAME = 'Fast Wallet System';
process.env.PORT = '3000';
process.env.STAGE = 'test';
process.env.DB_HOST = 'localhost';
process.env.DB_PORT = '5433';
process.env.DB_USER = 'postgres';
process.env.DB_PASS = '123456';
process.env.DB_NAME = 'fastwalletsystem_test';

process.env.REDIS_URL = 'redis://localhost:6379';
process.env.REDIS_TTL = '300';

process.env.JWT_SECRET =
  'super-secret-jwt-key-for-development-only-change-in-production';

process.env.DATABASE_URL =
  'postgresql://postgres:123456@localhost:5433/fastwalletsystem_test';

jest.setTimeout(20000);
