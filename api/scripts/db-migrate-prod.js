/**
 * Production Database Migration Script
 *
 * This script fetches credentials from AWS Secrets Manager and RDS endpoint,
 * then runs Prisma migrations against the production database.
 *
 * Prerequisites:
 * - AWS CLI configured with appropriate credentials
 * - RDS instance deployed via CDK (ApiStack-prod)
 *
 * Usage:
 *   npm run db:migrate:prod
 *
 * Or with environment variables:
 *   DB_SECRET_ID=/oriana/prod/db DB_HOST=oriana-db-prod.xxx.rds.amazonaws.com npm run db:migrate:prod
 *
 * Environment Variables (all optional - will auto-detect from CloudFormation):
 *   - AWS_REGION: AWS region (default: ap-south-1)
 *   - DB_SECRET_ID: Secrets Manager secret ID (default: /oriana/prod/db)
 *   - DB_HOST: RDS endpoint (auto-fetched from CloudFormation if not set)
 *   - DB_PORT: Database port (default: 5432)
 *   - DB_NAME: Database name (default: oriana)
 *   - DB_SSL: Enable SSL (default: true)
 *   - STACK_NAME: CloudFormation stack name (default: ApiStack-prod)
 */

const { execSync } = require("child_process");
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const {
  CloudFormationClient,
  DescribeStacksCommand,
} = require("@aws-sdk/client-cloudformation");

async function run() {
  console.log("🔧 Running production database migration...\n");

  const region = process.env.AWS_REGION || "ap-south-1";
  const secretId = process.env.DB_SECRET_ID || "/oriana/prod/db";
  const stackName = process.env.STACK_NAME || "ApiStack-prod";

  // Database connection details (can be overridden via env vars)
  let dbHost = process.env.DB_HOST;
  const dbPort = process.env.DB_PORT || "5432";
  const dbName = process.env.DB_NAME || "oriana";
  const dbSsl = process.env.DB_SSL !== "false";

  const secretsClient = new SecretsManagerClient({ region });

  try {
    // Step 1: If DB_HOST not provided, fetch from CloudFormation outputs
    if (!dbHost) {
      console.log(
        `   📦 Fetching RDS endpoint from CloudFormation stack (${stackName})...`
      );
      const cfnClient = new CloudFormationClient({ region });
      const stackResponse = await cfnClient.send(
        new DescribeStacksCommand({ StackName: stackName })
      );

      const outputs = stackResponse.Stacks?.[0]?.Outputs || [];
      const endpointOutput = outputs.find(
        (o) => o.ExportName === `Oriana-RDS-Endpoint-prod`
      );

      if (endpointOutput?.OutputValue) {
        dbHost = endpointOutput.OutputValue;
        console.log(`   ✅ Found RDS endpoint: ${dbHost}`);
      } else {
        throw new Error(
          "Could not find RDS endpoint in CloudFormation outputs.\n" +
            "   Either:\n" +
            "   - RDS is not deployed yet (run: npm run deploy:prod)\n" +
            "   - Set DB_HOST environment variable manually"
        );
      }
    } else {
      console.log(`   📡 Using DB_HOST from environment: ${dbHost}`);
    }

    // Step 2: Fetch credentials from Secrets Manager
    console.log(
      `   🔑 Fetching credentials from Secrets Manager (${secretId})...`
    );
    const secret = await secretsClient.send(
      new GetSecretValueCommand({ SecretId: secretId })
    );
    const credentials = JSON.parse(secret.SecretString);

    const { username, password } = credentials;

    if (!username || !password) {
      throw new Error('Secret must contain "username" and "password" fields');
    }

    console.log(`   ✅ Retrieved credentials for user: ${username}`);

    // Step 3: Construct DATABASE_URL
    const sslMode = dbSsl ? "?sslmode=require" : "";
    const DATABASE_URL = `postgresql://${username}:${encodeURIComponent(password)}@${dbHost}:${dbPort}/${dbName}${sslMode}`;

    console.log(
      `   🗄️  Connecting to: postgresql://${username}:****@${dbHost}:${dbPort}/${dbName}`
    );
    console.log("\n   🚀 Running prisma migrate deploy...\n");
    console.log("   " + "─".repeat(50) + "\n");

    // Step 4: Run Prisma migration
    execSync("npx prisma migrate deploy", {
      cwd: "./layers/shared/nodejs",
      env: { ...process.env, DATABASE_URL },
      stdio: "inherit",
    });

    console.log("\n   " + "─".repeat(50));
    console.log("\n✅ Migration completed successfully!");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);

    // Provide helpful error messages
    if (error.name === "ResourceNotFoundException") {
      console.error("\n💡 Hint: The secret was not found. Make sure:");
      console.error(`   - RDS stack is deployed (creates secret at ${secretId})`);
      console.error("   - You're using the correct AWS region");
      console.error("   - Your AWS credentials have permission to read the secret");
    } else if (error.name === "AccessDeniedException") {
      console.error("\n💡 Hint: Permission denied. Make sure your AWS credentials have:");
      console.error("   - secretsmanager:GetSecretValue permission");
      console.error("   - cloudformation:DescribeStacks permission");
    } else if (error.message?.includes("Connection refused")) {
      console.error("\n💡 Hint: Could not connect to database. Check:");
      console.error("   - RDS instance is running");
      console.error("   - Security group allows your IP address");
      console.error("   - You're connected to VPN (if RDS is private)");
    }

    process.exit(1);
  }
}

run();
