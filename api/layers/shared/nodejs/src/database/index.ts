import { Sequelize, Options } from 'sequelize';
import { getDatabaseConfig, DatabaseConfig } from '../utils/secrets';
import { logger } from '../utils/logger';
// Import pg directly so esbuild can bundle it (Sequelize uses dynamic require which doesn't bundle)
import * as pg from 'pg';

// Connection instance cached at module level for Lambda container reuse
let sequelizeInstance: Sequelize | null = null;
let isConnecting = false;
let connectionPromise: Promise<Sequelize> | null = null;

const createSequelizeOptions = (config: DatabaseConfig): Options => ({
  host: config.host,
  port: config.port,
  database: config.database,
  username: config.username,
  password: config.password,
  dialect: config.dialect,
  // Pass pg module directly to bypass Sequelize's dynamic require()
  // This is required for esbuild bundling to work correctly
  dialectModule: pg,
  logging: config.logging ? (msg) => logger.debug(msg) : false,
  pool: {
    max: 2, // Reduced for Lambda - each instance gets its own pool
    min: 0, // Allow pool to shrink to 0 when idle
    acquire: 10000, // Reduced timeout for faster failure
    idle: 5000, // Shorter idle timeout for Lambda
    evict: 1000, // Check for idle connections every second
  },
  dialectOptions: {
    // Connection timeout
    connectTimeout: 10000,
    // Keep connection alive
    keepAlive: true,
    // SSL for Supabase/RDS
    ssl:
      process.env.DB_SSL === 'true'
        ? {
            require: true,
            rejectUnauthorized: false,
          }
        : undefined,
  },
  define: {
    timestamps: true,
    underscored: true,
  },
  // Retry connection on failure
  retry: {
    max: 3,
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /ETIMEDOUT/,
      /ECONNREFUSED/,
    ],
  },
  // Benchmark queries in development
  benchmark: process.env.LOG_LEVEL === 'DEBUG',
});

/**
 * Get Sequelize instance with connection pooling optimized for Lambda.
 * Uses singleton pattern to reuse connection across warm Lambda invocations.
 */
export const getSequelize = async (): Promise<Sequelize> => {
  // Return existing instance if connected
  if (sequelizeInstance) {
    try {
      // Quick health check - don't await long operations
      await sequelizeInstance.authenticate({ logging: false });
      return sequelizeInstance;
    } catch (error) {
      logger.warn('Existing connection unhealthy, recreating...', error);
      await closeConnection();
    }
  }

  // Prevent multiple simultaneous connection attempts
  if (isConnecting && connectionPromise) {
    return connectionPromise;
  }

  isConnecting = true;
  connectionPromise = createConnection();

  try {
    sequelizeInstance = await connectionPromise;
    return sequelizeInstance;
  } finally {
    isConnecting = false;
    connectionPromise = null;
  }
};

const createConnection = async (): Promise<Sequelize> => {
  const startTime = Date.now();
  logger.info('Creating database connection...');

  const dbConfig = await getDatabaseConfig();
  const options = createSequelizeOptions(dbConfig);
  const sequelize = new Sequelize(options);

  try {
    await sequelize.authenticate();
    const duration = Date.now() - startTime;
    logger.info(`Database connection established in ${duration}ms`);
    return sequelize;
  } catch (error) {
    logger.error('Failed to connect to database', error);
    throw error;
  }
};

/**
 * Close database connection.
 * Call this in Lambda cleanup if needed.
 */
export const closeConnection = async (): Promise<void> => {
  if (sequelizeInstance) {
    try {
      await sequelizeInstance.close();
      logger.info('Database connection closed');
    } catch (error) {
      logger.warn('Error closing database connection', error);
    } finally {
      sequelizeInstance = null;
    }
  }
};

/**
 * Check if connection is healthy
 */
export const isConnectionHealthy = async (): Promise<boolean> => {
  if (!sequelizeInstance) return false;
  try {
    await sequelizeInstance.authenticate({ logging: false });
    return true;
  } catch {
    return false;
  }
};

// Re-export Sequelize types for convenience
export { Sequelize, DataTypes, Model, ModelStatic, Op, QueryTypes } from 'sequelize';
export type {
  Optional,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  Transaction,
} from 'sequelize';
