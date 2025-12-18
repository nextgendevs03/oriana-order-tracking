import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as iam from "aws-cdk-lib/aws-iam";
import { CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { EnvironmentConfig } from "../../config/environment";

/**
 * Props for StaticSiteConstruct
 */
export interface StaticSiteConstructProps {
  /** Environment configuration */
  config: EnvironmentConfig;
  /** Path to the built UI folder */
  uiBuildPath: string;
}

/**
 * Static Site Construct
 *
 * Creates S3 bucket for hosting static files and CloudFront distribution for CDN.
 * Uses Origin Access Control (OAC) for secure S3 access.
 *
 * IMPORTANT: Uses RemovalPolicy.RETAIN for production to prevent accidental deletion.
 *
 * Usage:
 * ```typescript
 * const staticSite = new StaticSiteConstruct(this, 'StaticSite', {
 *   config,
 *   uiBuildPath: path.join(__dirname, '../../../ui/build'),
 * });
 * ```
 */
export class StaticSiteConstruct extends Construct {
  /** S3 bucket for static site hosting */
  public readonly bucket: s3.Bucket;

  /** CloudFront distribution */
  public readonly distribution: cloudfront.Distribution;

  /** Website URL */
  public readonly websiteUrl: string;

  constructor(scope: Construct, id: string, props: StaticSiteConstructProps) {
    super(scope, id);

    const { config, uiBuildPath } = props;
    const isProd = config.environment === "prod";

    console.log(
      `   🌐 Creating static site hosting for ${config.environment}...`,
    );

    // S3 bucket for hosting static files
    // RETAIN for production to preserve data on stack deletion
    this.bucket = new s3.Bucket(this, "WebsiteBucket", {
      bucketName: `oriana-ui-${config.environment}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: isProd, // Enable versioning for production
      removalPolicy: isProd ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY,
      autoDeleteObjects: !isProd, // Only auto-delete for non-prod
    });

    // CloudFront Origin Access Control
    const oac = new cloudfront.S3OriginAccessControl(this, "OAC", {
      originAccessControlName: `oriana-ui-oac-${config.environment}`,
      description: `Origin Access Control for Oriana UI - ${config.environment}`,
      signing: cloudfront.Signing.SIGV4_ALWAYS,
    });

    // CloudFront distribution
    this.distribution = new cloudfront.Distribution(this, "Distribution", {
      comment: `Oriana UI - ${config.environment}`,
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
          originAccessControl: oac,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        compress: true,
      },
      defaultRootObject: "index.html",
      // Handle SPA routing - redirect 404s and 403s to index.html
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: undefined,
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: undefined,
        },
      ],
      priceClass: isProd
        ? cloudfront.PriceClass.PRICE_CLASS_ALL
        : cloudfront.PriceClass.PRICE_CLASS_100, // Cost optimization for non-prod
      enabled: true,
    });

    // Grant CloudFront access to S3 bucket
    this.bucket.addToResourcePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal("cloudfront.amazonaws.com")],
        actions: ["s3:GetObject"],
        resources: [this.bucket.arnForObjects("*")],
        conditions: {
          StringEquals: {
            "AWS:SourceArn": `arn:aws:cloudfront::${process.env.CDK_DEFAULT_ACCOUNT || "*"}:distribution/${this.distribution.distributionId}`,
          },
        },
      }),
    );

    // Deploy UI build files to S3
    new s3deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3deploy.Source.asset(uiBuildPath)],
      destinationBucket: this.bucket,
      distribution: this.distribution,
      distributionPaths: ["/*"], // Invalidate CloudFront cache on deploy
      memoryLimit: 512, // Increase memory for larger builds
    });

    this.websiteUrl = `https://${this.distribution.distributionDomainName}`;

    // Outputs
    new CfnOutput(this, "WebsiteURL", {
      value: this.websiteUrl,
      description: `CloudFront URL for Oriana UI - ${config.environment}`,
      exportName: `Oriana-UI-URL-${config.environment}`,
    });

    new CfnOutput(this, "WebsiteBucketName", {
      value: this.bucket.bucketName,
      description: `S3 Bucket for Oriana UI - ${config.environment}`,
      exportName: `Oriana-UI-BucketName-${config.environment}`,
    });

    new CfnOutput(this, "DistributionId", {
      value: this.distribution.distributionId,
      description: `CloudFront Distribution ID - ${config.environment}`,
      exportName: `Oriana-UI-DistributionId-${config.environment}`,
    });

    console.log(
      `   ✅ Static site will be available at: CloudFront URL (output after deploy)`,
    );
  }
}
