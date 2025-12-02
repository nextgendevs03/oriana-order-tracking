# Local Development Guide

## Overview

This guide explains how to run the Oriana Order Tracking API locally using AWS SAM CLI.

## Configuration Architecture

| Environment | Non-Sensitive Config | Secrets |
|-------------|---------------------|---------|
| **Local (SAM)** | `env.local.json` | `env.local.json` |
| **AWS (dev/qa/prod)** | Lambda env vars (CDK) | AWS Secrets Manager |

**Note**: `env.local.json` is **only for local SAM testing**. In AWS, Lambda environment variables are set via CDK and secrets are fetched from Secrets Manager.

## Prerequisites

- Node.js 22+
- Docker Desktop running
- AWS SAM CLI installed
- PostgreSQL database (Supabase recommended)

## Quick Start

### 1. Set Up Local Environment

```bash
cd cdk
cp env.template.json env.local.json
```

Edit `env.local.json` with your database credentials:

```json
{
  "LambdaConstructpoFunction7E547944": {
    "ENVIRONMENT": "dev",
    "IS_LOCAL": "true",
    "DB_HOST": "db.xxxxxxxxxxxx.supabase.co",
    "DB_PORT": "5432",
    "DB_NAME": "postgres",
    "DB_USERNAME": "postgres",
    "DB_PASSWORD": "your-supabase-password",
    "DB_SSL": "true",
    "LOG_LEVEL": "DEBUG"
  }
}
```

### 2. Build the Project

```bash
cd api
npm run build:all
```

### 3. Start Local API

```bash
cd cdk
npm run dev
```

The API will be available at `http://127.0.0.1:3000`

## Database Setup with Supabase

1. Create a Supabase project at https://supabase.com
2. Go to **Settings > Database** to find connection info
3. Copy the connection details to `env.local.json`

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start SAM local API |
| `npm run dev:fresh` | Clean build and start |
| `npm run dev:debug` | Start with debug logging |
| `npm run dev:quick` | Quick start (no API rebuild) |

## Troubleshooting

### "connect ECONNREFUSED" Error

Database connection failed. Check:
1. Database credentials in `env.local.json`
2. Database is running and accessible
3. For Supabase, verify `DB_SSL: "true"`

### Function Name in env.local.json

The key must match SAM's logical ID. Find it in `cdk.out/ApiStack-dev.template.json` or SAM output.

## Security

- **Never commit** `env.local.json` to Git (it's in `.gitignore`)
- Only `env.template.json` is committed
- AWS deployments use Secrets Manager for credentials
