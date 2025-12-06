/**
 * Production Database Migration Script
 * 
 * This script fetches DATABASE_URL from AWS Secrets Manager and runs Prisma migrations.
 * Use this for production deployments where credentials are stored in Secrets Manager.
 * 
 * Usage: npm run db:migrate:prod
 */

const { execSync } = require('child_process');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

async function run() {
  console.log('🔧 Running production database migration...');
  
  const region = process.env.AWS_REGION || 'ap-southeast-1';
  const secretId = process.env.DB_SECRET_ID || 'oriana/database';
  
  console.log(`   Fetching credentials from Secrets Manager (${secretId})...`);
  
  const client = new SecretsManagerClient({ region });
  
  try {
    const secret = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
    const { DATABASE_URL } = JSON.parse(secret.SecretString);
    
    if (!DATABASE_URL) {
      console.error('❌ Error: DATABASE_URL not found in secret');
      process.exit(1);
    }
    
    console.log('   Running prisma migrate deploy...');
    
    execSync('npx prisma migrate deploy', {
      cwd: './layers/shared/nodejs',
      env: { ...process.env, DATABASE_URL },
      stdio: 'inherit'
    });
    
    console.log('✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

run();

