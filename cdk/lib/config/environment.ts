export type Environment = "dev" | "qa" | "prod";

export interface EnvironmentConfig {
  environment: Environment;
  stackName: string;
  description: string;
  dbSecretId: string;
  logRetentionDays: number;
  lambdaMemorySize: number;
  lambdaTimeout: number;
  apiStageName: string;
  enableXRay: boolean;
  tags: Record<string, string>;
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
  },
};

export const getEnvironmentConfig = (env: Environment): EnvironmentConfig => {
  return environmentConfigs[env];
};
