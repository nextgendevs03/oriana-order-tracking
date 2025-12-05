export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export interface AppConfig {
  environment: string;
  isLocal: boolean;
  secretsManagerSecretId: string;
  region: string;
}

export const getAppConfig = (): AppConfig => {
  const environment = process.env.ENVIRONMENT || 'dev';
  const isLocal = process.env.AWS_SAM_LOCAL === 'true' || process.env.IS_LOCAL === 'true';

  return {
    environment,
    isLocal,
    secretsManagerSecretId: process.env.DB_SECRET_ID || `/oriana/${environment}/db`,
    region: process.env.AWS_REGION || 'ap-south-1',
  };
};

export const getLocalDatabaseConfig = (): DatabaseConfig => {
  // Debug: Log environment variables being used
  console.log('[DEBUG] DB Environment Variables:', {
    DB_HOST: process.env.DB_HOST || '(not set, using localhost)',
    DB_PORT: process.env.DB_PORT || '(not set, using 5432)',
    DB_NAME: process.env.DB_NAME || '(not set, using oriana)',
    DB_USERNAME: process.env.DB_USERNAME || '(not set, using postgres)',
    DB_PASSWORD: process.env.DB_PASSWORD ? '***SET***' : '(not set, using default)',
    DB_SSL: process.env.DB_SSL || '(not set)',
    IS_LOCAL: process.env.IS_LOCAL,
    AWS_SAM_LOCAL: process.env.AWS_SAM_LOCAL,
  });

  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'oriana',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.DB_SSL === 'true',
  };
};

/**
 * Build DATABASE_URL from config for Prisma
 */
export const buildDatabaseUrl = (config: DatabaseConfig): string => {
  const encodedPassword = encodeURIComponent(config.password);
  const sslParam = config.ssl ? '?sslmode=require' : '';
  return `postgresql://${config.username}:${encodedPassword}@${config.host}:${config.port}/${config.database}${sslParam}`;
};
