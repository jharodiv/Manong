
function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`)
  }

  return value;
}

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || '5000',
  databaseUrl: getEnvVariable('DATABASE_URL'),
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379'
  },
  jwt: {
    accessSecret: getEnvVariable('JWT_SECRET_ACCESS'),
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',

    refreshSecret: getEnvVariable('JWT_REFRESH_ACCESS'),
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  }
}
