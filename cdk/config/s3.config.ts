/**
 * S3 Bucket Configuration
 *
 * Define S3 buckets for each environment.
 * Each bucket can have environment-specific settings.
 */

import { Environment } from "../lib/config/environment";
import { RemovalPolicy } from "aws-cdk-lib";

/**
 * Configuration for a single S3 bucket
 */
export interface S3BucketConfig {
  /** Unique identifier for the bucket (used in construct IDs) */
  id: string;
  /** Base bucket name (environment suffix will be appended) */
  bucketNamePrefix: string;
  /** Enable versioning for the bucket */
  versioned?: boolean;
  /** Enable CORS for web access */
  enableCors?: boolean;
  /** Block all public access (recommended) */
  blockPublicAccess?: boolean;
  /** Enable server-side encryption */
  encryption?: boolean;
  /** Removal policy for the bucket */
  removalPolicy?: RemovalPolicy;
  /** Allowed CORS origins (if enableCors is true) */
  corsAllowedOrigins?: string[];
  /** Allowed CORS methods */
  corsAllowedMethods?: ("GET" | "PUT" | "POST" | "DELETE" | "HEAD")[];
}

/**
 * S3 configuration per environment
 */
export interface S3EnvironmentConfig {
  /** Array of bucket configurations for this environment */
  buckets: S3BucketConfig[];
}

/**
 * Default bucket configuration
 */
const defaultBucketConfig: Partial<S3BucketConfig> = {
  versioned: false,
  enableCors: true,
  blockPublicAccess: true,
  encryption: true,
  corsAllowedOrigins: ["*"],
  corsAllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
};

/**
 * S3 configuration for all environments
 *
 * Add or modify buckets as needed. Each environment can have
 * different bucket configurations.
 */
export const s3Config: Record<Environment, S3EnvironmentConfig> = {
  dev: {
    buckets: [
      {
        ...defaultBucketConfig,
        id: "uploads",
        bucketNamePrefix: "oriana-uploads",
        versioned: false,
        removalPolicy: RemovalPolicy.DESTROY,
      },
      {
        ...defaultBucketConfig,
        id: "documents",
        bucketNamePrefix: "oriana-documents",
        versioned: false,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    ],
  },
  qa: {
    buckets: [
      {
        ...defaultBucketConfig,
        id: "uploads",
        bucketNamePrefix: "oriana-uploads",
        versioned: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
      {
        ...defaultBucketConfig,
        id: "documents",
        bucketNamePrefix: "oriana-documents",
        versioned: true,
        removalPolicy: RemovalPolicy.DESTROY,
      },
    ],
  },
  prod: {
    buckets: [
      {
        ...defaultBucketConfig,
        id: "uploads",
        bucketNamePrefix: "oriana-uploads",
        versioned: true,
        removalPolicy: RemovalPolicy.RETAIN,
        corsAllowedOrigins: [
          "https://oriana.example.com",
          "https://app.oriana.example.com",
        ],
      },
      {
        ...defaultBucketConfig,
        id: "documents",
        bucketNamePrefix: "oriana-documents",
        versioned: true,
        removalPolicy: RemovalPolicy.RETAIN,
        corsAllowedOrigins: [
          "https://oriana.example.com",
          "https://app.oriana.example.com",
        ],
      },
    ],
  },
};

/**
 * Get S3 configuration for a specific environment
 */
export const getS3Config = (env: Environment): S3EnvironmentConfig => {
  return s3Config[env];
};
