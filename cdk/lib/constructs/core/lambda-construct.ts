import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as logs from "aws-cdk-lib/aws-logs";
import * as iam from "aws-cdk-lib/aws-iam";
import { Duration, CfnOutput } from "aws-cdk-lib";
import * as path from "path";
import * as fs from "fs";
import { EnvironmentConfig } from "../../config/environment";
import { AppManifest } from "../../utils/manifest-reader";

// Load local env vars from env.local.json for SAM Local development
const loadLocalEnvVars = (): Record<string, string> => {
  const envFilePath = path.join(__dirname, "../../../env.local.json");
  if (fs.existsSync(envFilePath)) {
    try {
      const envConfig = JSON.parse(fs.readFileSync(envFilePath, "utf-8"));
      // Try multiple possible keys (function name, logical ID, etc.)
      const envVars =
        envConfig["oriana-po-dev"] ||
        envConfig["LambdaConstructpoFunction7E547944"] ||
        envConfig["Parameters"] ||
        {};
      console.log("   📋 Loaded local env vars from env.local.json");
      return envVars;
    } catch (e) {
      console.warn("   ⚠️  Failed to parse env.local.json:", e);
    }
  }
  return {};
};

export interface LambdaConstructProps {
  config: EnvironmentConfig;
  sharedLayer: lambda.LayerVersion;
  manifest: AppManifest;
}

export class LambdaConstruct extends Construct {
  public readonly functions: Record<string, lambda.Function> = {};

  constructor(scope: Construct, id: string, props: LambdaConstructProps) {
    super(scope, id);

    const { config, sharedLayer, manifest } = props;

    // Create Lambda functions from manifest
    for (const [lambdaName, lambdaConfig] of Object.entries(manifest.lambdas)) {
      const fn = this.createLambdaFunction(
        lambdaName,
        lambdaConfig.handler,
        config,
        sharedLayer,
      );
      this.functions[lambdaName] = fn;
    }

    // If no functions in manifest, create default PO function
    if (Object.keys(this.functions).length === 0) {
      console.log("   No lambdas in manifest, creating default PO function");
      const fn = this.createLambdaFunction(
        "po",
        "dist/handlers/po.handler.handler",
        config,
        sharedLayer,
      );
      this.functions["po"] = fn;
    }
  }

  private createLambdaFunction(
    name: string,
    handler: string,
    config: EnvironmentConfig,
    sharedLayer: lambda.LayerVersion,
  ): lambda.Function {
    const logRetention = this.getLogRetention(config.logRetentionDays);

    const fn = new lambda.Function(this, `${name}Function`, {
      functionName: `oriana-${name}-${config.environment}`,
      description: `${name.toUpperCase()} Lambda - ${config.environment}`,
      runtime: lambda.Runtime.NODEJS_22_X,
      architecture: lambda.Architecture.ARM_64,
      handler: handler,
      code: lambda.Code.fromAsset(path.join(__dirname, "../../../../api"), {
        exclude: [
          "node_modules",
          "node_modules/**",
          "layers",
          "layers/**",
          "src",
          "src/**",
          "scripts",
          "scripts/**",
          "*.ts",
          "*.md",
          ".git",
          ".git/**",
          ".eslint*",
          "tsconfig.json",
          "jest.config.*",
          "coverage",
          "coverage/**",
          "*.test.*",
          "*.spec.*",
          "*.d.ts.map",
          "*.js.map",
          "**/*.d.ts.map",
          "**/*.js.map",
          ".env*",
          "*.log",
        ],
      }),
      memorySize: config.lambdaMemorySize,
      timeout: Duration.seconds(config.lambdaTimeout),
      environment: {
        ENVIRONMENT: config.environment,
        // Database connection settings (non-sensitive)
        DB_HOST: config.database.host,
        DB_PORT: config.database.port.toString(),
        DB_NAME: config.database.name,
        DB_SSL: config.database.ssl.toString(),
        // Secrets Manager secret ID for credentials (username/password only)
        DB_SECRET_ID: config.dbSecretId,
        LOG_LEVEL: config.environment === "prod" ? "INFO" : "DEBUG",
        NODE_OPTIONS: "--enable-source-maps",
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
        // Include local DB env vars for SAM Local development (dev environment only)
        ...(config.environment === "dev" ? loadLocalEnvVars() : {}),
      },
      layers: [sharedLayer],
      tracing: config.enableXRay
        ? lambda.Tracing.ACTIVE
        : lambda.Tracing.DISABLED,
      logRetention,
      reservedConcurrentExecutions:
        config.environment === "prod" ? 100 : undefined,
    });

    // Grant Secrets Manager access
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ["secretsmanager:GetSecretValue"],
        resources: [`arn:aws:secretsmanager:*:*:secret:${config.dbSecretId}*`],
      }),
    );

    // Grant CloudWatch Logs permissions
    fn.addToRolePolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
        ],
        resources: ["*"],
      }),
    );

    // Output function ARN
    new CfnOutput(this, `${name}FunctionArn`, {
      value: fn.functionArn,
      description: `${name.toUpperCase()} Lambda ARN - ${config.environment}`,
      exportName: `Oriana${name.charAt(0).toUpperCase() + name.slice(1)}FunctionArn-${config.environment}`,
    });

    console.log(`   Created Lambda: oriana-${name}-${config.environment}`);

    return fn;
  }

  private getLogRetention(days: number): logs.RetentionDays {
    const retentionMap: Record<number, logs.RetentionDays> = {
      1: logs.RetentionDays.ONE_DAY,
      3: logs.RetentionDays.THREE_DAYS,
      5: logs.RetentionDays.FIVE_DAYS,
      7: logs.RetentionDays.ONE_WEEK,
      14: logs.RetentionDays.TWO_WEEKS,
      30: logs.RetentionDays.ONE_MONTH,
      60: logs.RetentionDays.TWO_MONTHS,
      90: logs.RetentionDays.THREE_MONTHS,
      180: logs.RetentionDays.SIX_MONTHS,
      365: logs.RetentionDays.ONE_YEAR,
    };
    return retentionMap[days] || logs.RetentionDays.ONE_WEEK;
  }
}
