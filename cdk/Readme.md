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
│   └── cdk.ts                 # CDK app entry point
├── lib/
│   ├── config/
│   │   └── environment.ts     # Environment configurations
│   ├── constructs/
│   │   ├── lambda-construct.ts
│   │   └── api-gateway-construct.ts
│   ├── stacks/
│   │   └── api-stack.ts       # Main API stack
│   └── utils/
│       └── manifest-reader.ts # Reads app-manifest.json
├── events/                    # Test event payloads
│   ├── po-create.json
│   └── po-list.json
├── env.json                   # Local environment variables
├── cdk.json                   # CDK configuration
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

### Step 1: Build the API (Terminal 1)

```bash
cd api
npm install
npm run build:all    # Build layer + API + manifest
npm run watch        # Watch mode with hot reload
```

### Step 2: Configure Environment Variables

Edit `cdk/env.json` with your Supabase credentials:

```json
{
  "poFunction": {
    "ENVIRONMENT": "dev",
    "IS_LOCAL": "true",
    "DB_HOST": "db.xxxxxxxxxxxx.supabase.co",
    "DB_PORT": "5432",
    "DB_NAME": "postgres",
    "DB_USERNAME": "postgres",
    "DB_PASSWORD": "your-supabase-password",
    "LOG_LEVEL": "DEBUG"
  }
}
```

### Step 3: Start Local API Server (Terminal 2)

```bash
cd cdk

# Full build + synth + start
npm run dev

# Quick start (skip API build)
npm run dev:quick

# Debug mode
npm run dev:debug
```

The API will be available at: `http://localhost:4000`

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
| `npm run dev` | Build API + Synth + Start local API on port 4000 |
| `npm run dev:port` | Same as dev, but uses `API_PORT` env var (default: 4000) |
| `npm run dev:quick` | Synth + Start (skip API build) |
| `npm run dev:eager` | Eager container mode |
| `npm run dev:debug` | Debug mode with verbose logging |
| `npm run invoke:po` | Invoke PO Lambda locally |
| `npm run invoke:po:event` | Invoke with test event |

### Build & Synth
| Script | Description |
|--------|-------------|
| `npm run build` | Compile CDK TypeScript |
| `npm run build:api` | Build API + generate manifest |
| `npm run synth:dev` | Synthesize dev stack |
| `npm run synth:qa` | Synthesize QA stack |
| `npm run synth:prod` | Synthesize prod stack |

### Deployment
| Script | Description |
|--------|-------------|
| `npm run deploy:dev` | Build + Deploy to dev |
| `npm run deploy:qa` | Build + Deploy to QA |
| `npm run deploy:prod` | Build + Deploy to production |
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

| Environment | Stack Name | Database | Memory | Timeout |
|-------------|------------|----------|--------|---------|
| dev | ApiStack-dev | Supabase | 256 MB | 30s |
| qa | ApiStack-qa | RDS | 512 MB | 30s |
| prod | ApiStack-prod | RDS | 1024 MB | 30s |

## Performance Optimizations

- **ARM64 Architecture**: 20% better price-performance
- **Connection Reuse**: `AWS_NODEJS_CONNECTION_REUSE_ENABLED=1`
- **esbuild**: ~100x faster builds
- **Manifest-based routing**: No runtime route scanning

## Secrets Manager Setup

```bash
# Create secrets for each environment
aws secretsmanager create-secret \
  --name /oriana/dev/db \
  --secret-string '{"host":"xxx","port":5432,"dbname":"postgres","username":"xxx","password":"xxx"}'
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
