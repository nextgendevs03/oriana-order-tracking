export type Environment = "dev" | "qa" | "prod";

/**
 * Feature flags to enable/disable AWS services per environment.
 * Set to true to enable the service, false to disable.
 */
export interface FeatureFlags {
  s3: boolean;
  sqs: boolean;
  dynamodb: boolean;
  ses: boolean;
  vpc: boolean;
  cognito: boolean;
  kms: boolean;
  /** Enable static site hosting (S3 + CloudFront) for UI */
  staticSite: boolean;
  /** Enable RDS PostgreSQL database (recommended for prod only) */
  rds: boolean;
}

/**
 * Default feature flags - all disabled by default.
 * Override in environment-specific configs as needed.
 */
const defaultFeatures: FeatureFlags = {
  s3: false,
  sqs: false,
  dynamodb: false,
  ses: false,
  vpc: false,
  cognito: false,
  kms: false,
  staticSite: false,
  rds: false,
};

/**
 * Database connection configuration (non-sensitive).
 * Credentials (username/password) are stored in AWS Secrets Manager.
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  name: string;
  ssl: boolean;
}

export interface EnvironmentConfig {
  environment: Environment;
  stackName: string;
  description: string;
  /** Secrets Manager secret ID for database credentials (username/password only) */
  dbSecretId: string;
  logRetentionDays: number;
  lambdaMemorySize: number;
  lambdaTimeout: number;
  apiStageName: string;
  enableXRay: boolean;
  tags: Record<string, string>;
  /** Feature flags to enable/disable AWS services */
  features: FeatureFlags;
  /** Database connection settings (non-sensitive) */
  database: DatabaseConfig;
}

const baseConfig = {
  tags: {
    Project: "Oriana",
    Application: "OrderTracking",
    ManagedBy: "CDK",
  },
};

export const environmentConfigs: Record<Environment, EnvironmentConfig> = {
  dev: {
    ...baseConfig,
    environment: "dev",
    stackName: "ApiStack-dev",
    description: "Oriana Order Tracking API - Development Environment",
    dbSecretId: "/oriana/dev/db",
    logRetentionDays: 7,
    lambdaMemorySize: 256,
    lambdaTimeout: 30,
    apiStageName: "dev",
    enableXRay: false,
    tags: {
      ...baseConfig.tags,
      Environment: "dev",
    },
    features: {
      ...defaultFeatures,
      s3: true, // Enable S3 for dev
      staticSite: true, // Enable UI hosting for dev
      rds: false, // Dev uses external DB (Neon/Supabase)
    },
    database: {
      host: "db.xxxxxxxxxxxx.supabase.co", // TODO: Replace with your Supabase host
      port: 5432,
      name: "postgres",
      ssl: true,
    },
  },
  qa: {
    ...baseConfig,
    environment: "qa",
    stackName: "ApiStack-qa",
    description: "Oriana Order Tracking API - QA Environment",
    dbSecretId: "/oriana/qa/db",
    logRetentionDays: 14,
    lambdaMemorySize: 512,
    lambdaTimeout: 30,
    apiStageName: "qa",
    enableXRay: true,
    tags: {
      ...baseConfig.tags,
      Environment: "qa",
    },
    features: {
      ...defaultFeatures,
      s3: true, // Enable S3 for qa
      staticSite: true, // Enable UI hosting for qa
      rds: false, // QA uses external DB (Neon/Supabase)
    },
    database: {
      host: "db.xxxxxxxxxxxx.supabase.co", // TODO: Replace with your QA Supabase host
      port: 5432,
      name: "postgres",
      ssl: true,
    },
  },
  prod: {
    ...baseConfig,
    environment: "prod",
    stackName: "ApiStack-prod",
    description: "Oriana Order Tracking API - Production Environment",
    dbSecretId: "/oriana/prod/db",
    logRetentionDays: 90,
    lambdaMemorySize: 1024,
    lambdaTimeout: 30,
    apiStageName: "prod",
    enableXRay: true,
    tags: {
      ...baseConfig.tags,
      Environment: "prod",
    },
    features: {
      ...defaultFeatures,
      s3: true, // Enable S3 for prod
      staticSite: true, // Enable UI hosting for prod
      rds: true, // Enable AWS RDS for production
    },
    database: {
      host: "", // Will be set from RDS construct output
      port: 5432,
      name: "oriana",
      ssl: true,
    },
  },
};

export const getEnvironmentConfig = (env: Environment): EnvironmentConfig => {
  return environmentConfigs[env];
};
