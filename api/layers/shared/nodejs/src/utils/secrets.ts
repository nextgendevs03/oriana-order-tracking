import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';
import { getAppConfig, DatabaseConfig, getLocalDatabaseConfig } from '../config';
import { logger } from './logger';

interface DatabaseSecrets {
  host: string;
  port: number;
  dbname: string;
  username: string;
  password: string;
}

// Cache at module level for Lambda container reuse
let secretsClient: SecretsManagerClient | null = null;
let cachedDbConfig: DatabaseConfig | null = null;
let configCacheExpiry: number = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const getSecretsClient = (): SecretsManagerClient => {
  if (!secretsClient) {
    const config = getAppConfig();
    secretsClient = new SecretsManagerClient({
      region: config.region,
      // Optimize for Lambda
      maxAttempts: 3,
    });
  }
  return secretsClient;
};

/**
 * Get database configuration with caching.
 * Caches config for 5 minutes to reduce Secrets Manager calls.
 */
export const getDatabaseConfig = async (): Promise<DatabaseConfig> => {
  const now = Date.now();

  // Return cached config if still valid
  if (cachedDbConfig && configCacheExpiry > now) {
    logger.debug('Using cached database configuration');
    return cachedDbConfig;
  }

  const appConfig = getAppConfig();

  // Use local config for local development
  if (appConfig.isLocal) {
    logger.info('Using local database configuration');
    cachedDbConfig = getLocalDatabaseConfig();
    configCacheExpiry = now + CACHE_TTL_MS;
    return cachedDbConfig;
  }

  try {
    const startTime = Date.now();
    logger.info('Fetching database credentials from Secrets Manager', {
      secretId: appConfig.secretsManagerSecretId,
    });

    const client = getSecretsClient();
    const command = new GetSecretValueCommand({
      SecretId: appConfig.secretsManagerSecretId,
    });

    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error('Secret value is empty');
    }

    const secrets: DatabaseSecrets = JSON.parse(response.SecretString);
    const duration = Date.now() - startTime;

    cachedDbConfig = {
      host: secrets.host,
      port: secrets.port,
      database: secrets.dbname,
      username: secrets.username,
      password: secrets.password,
      dialect: 'postgres',
      logging: process.env.DB_LOGGING === 'true',
      pool: {
        max: 2,
        min: 0,
        acquire: 10000,
        idle: 5000,
      },
    };

    configCacheExpiry = now + CACHE_TTL_MS;
    logger.info(`Retrieved database configuration in ${duration}ms`);
    return cachedDbConfig;
  } catch (error) {
    logger.error('Failed to retrieve database credentials from Secrets Manager', error);
    throw error;
  }
};

/**
 * Clear secrets cache - useful for testing or forced refresh
 */
export const clearSecretsCache = (): void => {
  cachedDbConfig = null;
  configCacheExpiry = 0;
};

/**
 * Export DatabaseConfig type for use in other modules
 */
export type { DatabaseConfig };
