import { Stack, StackProps, Tags, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as path from "path";
import { EnvironmentConfig } from "../config/environment";
import { LambdaConstruct } from "../constructs/lambda-construct";
import { ApiGatewayConstruct } from "../constructs/api-gateway-construct";
import { readManifest } from "../utils/manifest-reader";

export interface ApiStackProps extends StackProps {
  config: EnvironmentConfig;
}

export class ApiStack extends Stack {
  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, {
      ...props,
      description: props.config.description,
    });

    const { config } = props;

    console.log(`\n🚀 Building stack: ${config.stackName}`);

    // Apply tags to all resources
    Object.entries(config.tags).forEach(([key, value]) => {
      Tags.of(this).add(key, value);
    });

    // Read app manifest
    const manifest = readManifest();

    // Create Shared Lambda Layer (using bundled output to avoid Windows long path issues)
    console.log("\n📦 Creating shared Lambda layer...");
    const sharedLayer = new lambda.LayerVersion(this, "SharedLayer", {
      layerVersionName: `oriana-shared-layer-${config.environment}`,
      description: "Shared utilities, database connection, and middleware",
      code: lambda.Code.fromAsset(
        path.join(__dirname, "../../../api/layers/shared/bundled"),
      ),
      compatibleRuntimes: [lambda.Runtime.NODEJS_22_X],
      compatibleArchitectures: [
        lambda.Architecture.X86_64,
        lambda.Architecture.ARM_64,
      ],
      removalPolicy:
        config.environment === "prod"
          ? RemovalPolicy.RETAIN
          : RemovalPolicy.DESTROY,
    });

    // Create Lambda Functions from manifest
    console.log("\n⚡ Creating Lambda functions...");
    const lambdaConstruct = new LambdaConstruct(this, "LambdaConstruct", {
      config,
      sharedLayer,
      manifest,
    });

    // Create API Gateway with routes from manifest
    console.log("\n🌐 Creating API Gateway routes...");
    new ApiGatewayConstruct(this, "ApiGatewayConstruct", {
      config,
      lambdaFunctions: lambdaConstruct.functions,
      manifest,
    });

    console.log(`\n✅ Stack ${config.stackName} ready\n`);
  }
}
