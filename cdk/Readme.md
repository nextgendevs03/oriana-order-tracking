# Oriana Order Tracking - CDK Infrastructure

AWS CDK infrastructure for the Oriana Order Tracking API with decorator-based routing.

## Prerequisites

Before running the project locally, you **must** install the following tools:

| Tool | Version | Required For | Download Link |
|------|---------|--------------|---------------|
| **Node.js** | 22.x+ | Running CDK & API | [nodejs.org](https://nodejs.org/) |
| **AWS CLI** | v2 | AWS credentials & SAM dependency | [AWS CLI Install Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) |
| **AWS SAM CLI** | Latest | **Local Lambda development** | [SAM CLI Install Guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) |
| **Docker Desktop** | Latest | **Required by SAM CLI** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |

> ⚠️ **Important**: SAM CLI and Docker are **required** to run `npm run dev`. SAM CLI uses Docker to simulate the Lambda environment locally.

### Verify Installation

```bash
# Check Node.js
node --version        # Should be v22.x or later

# Check AWS CLI
aws --version         # Should be aws-cli/2.x.x

# Check SAM CLI
sam --version         # Should be SAM CLI, version 1.x.x

# Check Docker is running
docker --version      # Should be Docker version 2x.x.x
docker info           # Should show Docker daemon is running

# Configure AWS credentials (if not done)
aws configure
```

### Docker Must Be Running

Before running `npm run dev`, ensure Docker Desktop is **started and running**. You can verify with:

```bash
docker info
# If this fails, start Docker Desktop first
```

## How It Works

```
Build Time:
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Controllers    │ ──► │  Build Script    │ ──► │ app-manifest.json│
│  with Decorators│     │  (scan & extract)│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘

CDK Synth Time:
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│ app-manifest.json│ ──► │  CDK Stack       │ ──► │ API Gateway     │
│                 │     │  (read manifest) │     │ Routes          │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

1. Controllers define routes using decorators (`@Get`, `@Post`, etc.)
2. Build script scans controllers and generates `app-manifest.json`
3. CDK reads the manifest and creates API Gateway routes automatically

## Project Structure

```
cdk/
├── bin/
│   └── cdk.ts                      # CDK app entry point
├── config/                         # Service-specific configurations
│   ├── index.ts                    # Exports all configs
│   ├── s3.config.ts                # S3 bucket configurations
│   └── rds.config.ts               # RDS database configurations
├── lib/
│   ├── config/
│   │   └── environment.ts          # Environment configs & feature flags
│   ├── constructs/
│   │   ├── core/
│   │   │   ├── lambda-construct.ts
│   │   │   └── api-gateway-construct.ts
│   │   ├── storage/
│   │   │   └── s3-construct.ts     # S3 bucket creation
│   │   ├── database/
│   │   │   └── rds-construct.ts    # RDS PostgreSQL database
│   │   ├── hosting/
│   │   │   └── static-site-construct.ts  # UI hosting (S3 + CloudFront)
│   │   └── permissions/
│   │       └── lambda-permissions.ts
│   ├── stacks/
│   │   └── api-stack.ts            # Main API stack
│   └── utils/
│       └── manifest-reader.ts      # Reads app-manifest.json
├── events/                         # Test event payloads
│   ├── po-create.json
│   └── po-list.json
├── env.local.json                  # Local environment variables
├── cdk.json                        # CDK configuration
├── package.json
└── tsconfig.json
```

## Setup

```bash
# Install dependencies
cd cdk
npm install

# Bootstrap CDK (first time only)
npm run bootstrap
```

## Local Development

### Step 1: Configure Environment Variables

Copy `env.template.json` to `env.local.json` and fill in your values:

```bash
cd cdk
cp env.template.json env.local.json
```

Edit `cdk/env.local.json` with your database and JWT credentials:

```json
{
  "oriana-po-dev": {
    "ENVIRONMENT": "dev",
    "IS_LOCAL": "true",
    "DB_HOST": "db.xxxxxxxxxxxx.supabase.co",
    "DB_PORT": "5432",
    "DB_NAME": "postgres",
    "DB_USERNAME": "postgres",
    "DB_PASSWORD": "your-supabase-password",
    "DB_SSL": "true",
    "LOG_LEVEL": "DEBUG",
    "JWT_SECRET": "your-local-dev-jwt-secret-at-least-32-chars",
    "JWT_REFRESH_SECRET": "your-local-dev-refresh-secret-at-least-32-chars",
    "JWT_EXPIRES_IN": "15m",
    "JWT_REFRESH_EXPIRES_IN": "1d"
  }
}
```

**Note:** `env.local.json` is gitignored and should never be committed.

### Step 2: Start Development Server

**Option A: Single Command (Recommended)**
```bash
cd cdk
npm run dev:all
```
This runs both API watch mode and SAM Local in one terminal with automatic hot reload.

**Option B: Two Terminals (More Control)**
```bash
# Terminal 1 - API Watch Mode
cd api
npm run watch

# Terminal 2 - SAM with Hot Reload
cd cdk
npm run dev:watch
```

**Option C: Manual Mode**
```bash
cd cdk
npm run dev          # Full build + synth + start (manual restart required)
npm run dev:quick    # Quick start (skip API build)
npm run dev:debug    # Debug mode
```

The API will be available at: `http://localhost:4000`

### How Hot Reload Works

The optimized hot reload flow uses a simple signal-based approach:

1. **esbuild watch mode** rebuilds TypeScript → writes `api/dist/.restart` signal file
2. **Native file watcher** detects signal file change → restarts SAM automatically
3. **No external dependencies** - uses Node.js built-in `fs.watchFile`

When you edit code:
- esbuild rebuilds → signal file updated
- SAM restarts automatically
- Changes are live instantly!

This approach is simpler, faster, and has zero external dependencies beyond what's already in the project.

### Using a Custom Port

The default port is `4000` to avoid conflicts with UI development servers (which typically use 3000).

**Option 1: Use the configurable script**
```bash
# Windows PowerShell
$env:API_PORT=5000; npm run dev:port

# Windows CMD
set API_PORT=5000 && npm run dev:port

# Mac/Linux
API_PORT=5000 npm run dev:port
```

**Option 2: Run SAM manually**
```bash
npm run synth:dev && sam local start-api -p 5000 -t cdk.out/ApiStack-dev.template.json --env-vars env.local.json --warm-containers LAZY --skip-pull-image
```

## NPM Scripts

### Development
| Script | Description |
|--------|-------------|
| `npm run dev:all` | **Single command** - Runs API watch + SAM with hot reload (recommended) |
| `npm run dev:watch` | **Hot reload mode** - Synth + Start SAM with auto-restart on code changes |
| `npm run dev` | Build API + Synth + Start local API on port 4000 |
| `npm run dev:port` | Same as dev, but uses `API_PORT` env var (default: 4000) |
| `npm run dev:quick` | Synth + Start (skip API build) |
| `npm run dev:eager` | Eager container mode |
| `npm run dev:debug` | Debug mode with verbose logging |
| `npm run invoke:po` | Invoke PO Lambda locally |
| `npm run invoke:po:event` | Invoke with test event |

### Build Commands
| Script | Description |
|--------|-------------|
| `npm run build` | Compile CDK TypeScript |
| `npm run build:api` | Build API + generate manifest |
| `npm run build:ui` | Build UI (React) |
| `npm run build:all` | Build both API + UI |
| `npm run synth:dev` | Synthesize dev stack |
| `npm run synth:qa` | Synthesize QA stack |
| `npm run synth:prod` | Synthesize prod stack |

### Deployment - Full (API + UI)
| Script | Description |
|--------|-------------|
| `npm run deploy:dev` | Build API + UI + Deploy to dev |
| `npm run deploy:qa` | Build API + UI + Deploy to QA |
| `npm run deploy:prod` | Build API + UI + Deploy to production |

### Deployment - API Only (Faster)
| Script | Description |
|--------|-------------|
| `npm run deploy:api:dev` | Build API only + Deploy to dev |
| `npm run deploy:api:qa` | Build API only + Deploy to QA |
| `npm run deploy:api:prod` | Build API only + Deploy to production |

### Other Commands
| Script | Description |
|--------|-------------|
| `npm run diff:dev` | Show changes for dev |
| `npm run destroy:dev` | Destroy dev stack |
| `npm run bootstrap` | Bootstrap CDK |

## App Manifest

CDK reads `api/app-manifest.json` to create API Gateway routes:

```json
{
  "version": "1.0",
  "lambdas": {
    "po": {
      "handler": "dist/handlers/po.handler.handler",
      "controller": "POController",
      "routes": [
        { "method": "POST", "path": "/api/po", "controller": "POController", "action": "create" },
        { "method": "GET", "path": "/api/po", "controller": "POController", "action": "getAll" },
        { "method": "GET", "path": "/api/po/{id}", "controller": "POController", "action": "getById" },
        { "method": "PUT", "path": "/api/po/{id}", "controller": "POController", "action": "update" },
        { "method": "DELETE", "path": "/api/po/{id}", "controller": "POController", "action": "delete" }
      ]
    }
  }
}
```

### Adding New Routes

1. Add decorator to controller method:
```typescript
@Get('/search')
async search(@Query('q') query: string) { }
```

2. Rebuild manifest and synth:
```bash
cd api && npm run build:manifest
cd ../cdk && npm run synth:dev
```

Routes are automatically added to API Gateway!

## Environment-Specific Configuration

| Environment | Stack Name | Database | Memory | UI Hosting | RDS | JWT Expiry |
|-------------|------------|----------|--------|------------|-----|------------|
| dev | ApiStack-dev | Neon/Supabase | 256 MB | ✅ CloudFront | ❌ | 15m / 1d |
| qa | ApiStack-qa | Neon/Supabase | 512 MB | ✅ CloudFront | ❌ | 15m / 7d |
| prod | ApiStack-prod | AWS RDS | 1024 MB | ✅ CloudFront | ✅ | 30m / 30d |

### Secrets Configuration

| Secret Type | Local Dev | QA/Prod |
|-------------|-----------|---------|
| Database credentials | `env.local.json` | AWS Secrets Manager (`/oriana/{env}/db`) |
| JWT secrets | `env.local.json` | AWS Secrets Manager (`/oriana/{env}/jwt`) |
| JWT expiry times | `env.local.json` | CDK environment config (Lambda env vars) |

### Feature Flags

Configure in `cdk/lib/config/environment.ts`:

```typescript
features: {
  s3: true,         // S3 buckets for file storage
  staticSite: true, // UI hosting (S3 + CloudFront)
  rds: true,        // AWS RDS PostgreSQL (prod only recommended)
}
```

### Infrastructure Created

| Resource | Dev/QA | Production |
|----------|--------|------------|
| Lambda Functions | ✅ | ✅ |
| API Gateway | ✅ | ✅ |
| S3 Buckets (uploads, documents) | ✅ | ✅ (RETAIN) |
| UI Hosting (S3 + CloudFront) | ✅ | ✅ (RETAIN) |
| RDS PostgreSQL | ❌ | ✅ (SNAPSHOT on delete) |
| VPC | ❌ | ✅ (for RDS) |

### Data Protection

Production resources use `RemovalPolicy.RETAIN` or `RemovalPolicy.SNAPSHOT`:
- **S3 Buckets**: Won't be deleted on stack updates
- **RDS Database**: Creates final snapshot before any deletion
- **RDS Deletion Protection**: Enabled for production

## Performance Optimizations

- **ARM64 Architecture**: 20% better price-performance
- **Connection Reuse**: `AWS_NODEJS_CONNECTION_REUSE_ENABLED=1`
- **esbuild**: ~100x faster builds
- **Manifest-based routing**: No runtime route scanning

## UI Deployment (Static Site Hosting)

The UI is automatically deployed to S3 + CloudFront when you run `npm run deploy:dev`.

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Route53   │────▶│  CloudFront │────▶│  S3 Bucket  │
│ (Optional)  │     │    (CDN)    │     │(Static Site)│
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  ACM Cert   │
                    │(Free HTTPS) │
                    └─────────────┘
```

### Features

- **CloudFront CDN**: Global edge caching for fast load times
- **HTTPS**: Automatic HTTPS with CloudFront's default certificate
- **SPA Routing**: 404/403 errors redirect to index.html for client-side routing
- **Cache Invalidation**: Automatic cache invalidation on each deploy
- **Cost Optimized**: Uses PRICE_CLASS_100 for non-prod (cheaper, fewer edge locations)

### Outputs

After deployment, you'll see:
```
Outputs:
StaticSiteConstruct.WebsiteURL = https://d1234567890.cloudfront.net
StaticSiteConstruct.WebsiteBucketName = oriana-ui-dev
StaticSiteConstruct.DistributionId = E1234567890
```

### Estimated Costs

| Service | Monthly Cost |
|---------|-------------|
| S3 Storage | ~$0.01-0.05 |
| CloudFront (first 1TB free) | $0 |
| **Total** | **~$0.50-1/month** |

## RDS Database (Production Only)

Production environment uses AWS RDS PostgreSQL.

### Configuration

Edit `cdk/config/rds.config.ts`:

```typescript
prod: {
  instanceClass: ec2.InstanceClass.T4G,
  instanceSize: ec2.InstanceSize.MICRO, // ~$12/month (cheapest)
  allocatedStorage: 20,
  multiAz: false, // Enable for high availability (~2x cost)
  deletionProtection: true,
}
```

### Instance Sizes & Costs

| Instance | vCPU/RAM | Single-AZ | Multi-AZ |
|----------|----------|-----------|----------|
| db.t4g.micro | 2/1GB | ~$12/mo | ~$24/mo |
| db.t4g.small | 2/2GB | ~$24/mo | ~$48/mo |
| db.t4g.medium | 2/4GB | ~$48/mo | ~$96/mo |

### Data Protection

- **Deletion Protection**: Enabled (prevents accidental deletion)
- **RemovalPolicy.SNAPSHOT**: Creates final snapshot if stack is deleted
- **Automated Backups**: 7 days retention

### Database Credentials

Credentials are automatically stored in AWS Secrets Manager at `/oriana/prod/db`.

```bash
# Retrieve credentials
aws secretsmanager get-secret-value --secret-id /oriana/prod/db
```

## Secrets Manager Setup

### Database Secrets

```bash
# Create database secrets for each environment
aws secretsmanager create-secret \
  --name /oriana/dev/db \
  --secret-string '{"username":"postgres","password":"your-db-password"}'

aws secretsmanager create-secret \
  --name /oriana/qa/db \
  --secret-string '{"username":"postgres","password":"your-qa-db-password"}'

aws secretsmanager create-secret \
  --name /oriana/prod/db \
  --secret-string '{"username":"postgres","password":"your-prod-db-password"}'
```

### JWT Secrets (Automatically Generated)

JWT secrets (`JWT_SECRET` and `JWT_REFRESH_SECRET`) are **automatically generated by CDK** during deployment. No manual secret creation is required!

**How it works:**
- CDK creates a `JwtSecretsConstruct` that generates cryptographically secure random secrets
- Secrets are stored in AWS Secrets Manager at `/oriana/{env}/jwt`
- Each environment (dev, qa, prod) gets its own unique secrets
- Production secrets use `RemovalPolicy.RETAIN` to prevent accidental deletion

**For local development:**
- JWT secrets are read from `env.local.json` (not from Secrets Manager)
- Copy `env.template.json` to `env.local.json` and add your local secrets

**Secret structure in Secrets Manager:**
```json
{
  "JWT_SECRET": "<auto-generated-128-char-string>",
  "JWT_REFRESH_SECRET": "<auto-generated-128-char-string>"
}
```

**View deployed secrets (if needed):**
```bash
# Retrieve JWT secrets (for debugging only - don't log these!)
aws secretsmanager get-secret-value --secret-id /oriana/prod/jwt --query SecretString --output text
```

### Retrieve Secrets

```bash
# Retrieve database credentials
aws secretsmanager get-secret-value --secret-id /oriana/prod/db

# Retrieve JWT secrets
aws secretsmanager get-secret-value --secret-id /oriana/prod/jwt
```

## Troubleshooting

### SAM CLI not found
```bash
# Install SAM CLI first
# Windows: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
# Verify installation
sam --version
```

### Docker not running
SAM CLI requires Docker to simulate the Lambda environment.

```bash
# Check if Docker is running
docker info

# If not running, start Docker Desktop first, then retry
npm run dev
```

### Manifest not found
```bash
cd api && npm run build:manifest
```

### Routes not updating
```bash
cd api && npm run build:all
cd ../cdk && npm run synth:dev
```

### Port already in use
```bash
# Windows PowerShell - check what's using the port
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or just use a different port (e.g., 5000)
npm run synth:dev && sam local start-api -p 5000 -t cdk.out/ApiStack-dev.template.json --env-vars env.local.json --warm-containers LAZY --skip-pull-image
```

### AWS credentials not configured
```bash
# Configure AWS CLI
aws configure
# Enter: Access Key ID, Secret Access Key, Region (e.g., us-east-1), Output format (json)
```
