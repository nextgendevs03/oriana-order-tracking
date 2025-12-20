---
name: JWT Config Management
overview: Implement a centralized JWT configuration management system that stores sensitive secrets (JWT_SECRET, JWT_REFRESH_SECRET) in AWS Secrets Manager and non-sensitive settings (expiry times) in CDK environment config, following the same proven pattern already used for database configuration.
todos:
  - id: cdk-jwt-config
    content: Add JWT config interface and settings to environment.ts
    status: pending
  - id: lambda-jwt-env
    content: Update lambda-construct.ts with JWT env vars and Secrets Manager permissions
    status: pending
    dependencies:
      - cdk-jwt-config
  - id: jwt-secrets-util
    content: Create jwt-secrets.ts utility for fetching secrets with caching
    status: pending
  - id: refactor-webtoken
    content: Refactor webtoken.ts to use async secrets loading
    status: pending
    dependencies:
      - jwt-secrets-util
  - id: update-exports
    content: Export jwt-secrets module from shared layer index.ts
    status: pending
    dependencies:
      - jwt-secrets-util
  - id: update-env-template
    content: Update env.template.json with JWT variables for local dev
    status: pending
---

# JWT and Environment Configuration Management

## Architecture Overview

```mermaid
flowchart TB
    subgraph local [Local Development]
        EnvLocal[env.local.json]
        EnvLocal --> Lambda1[Lambda via SAM]
    end
    
    subgraph deployed [QA/Prod Environments]
        CDK[CDK environment.ts]
        SM[AWS Secrets Manager]
        
        CDK -->|Non-sensitive config| LambdaEnv[Lambda Env Vars]
        SM -->|Sensitive secrets| Runtime[Runtime fetch with caching]
        LambdaEnv --> Lambda2[Lambda Function]
        Runtime --> Lambda2
    end
    
    subgraph secrets_structure [Secrets Manager Structure]
        DBSecret["/oriana/{env}/db<br/>username, password"]
        JWTSecret["/oriana/{env}/jwt<br/>JWT_SECRET, JWT_REFRESH_SECRET"]
    end
```

## Configuration Categories

| Config Type | Local Dev | QA/Prod | Storage Location |

|-------------|-----------|---------|------------------|

| `JWT_SECRET` | env.local.json | AWS Secrets Manager | /oriana/{env}/jwt |

| `JWT_REFRESH_SECRET` | env.local.json | AWS Secrets Manager | /oriana/{env}/jwt |

| `JWT_EXPIRES_IN` | env.local.json | CDK environment.ts | Lambda env vars |

| `JWT_REFRESH_EXPIRES_IN` | env.local.json | CDK environment.ts | Lambda env vars |

## Implementation Steps

### Step 1: Update CDK Environment Config

Add JWT configuration to [cdk/lib/config/environment.ts](cdk/lib/config/environment.ts):

- Add `JwtConfig` interface with `expiresIn`, `refreshExpiresIn`, and `secretId` properties
- Add `jwt` config to `EnvironmentConfig` interface
- Configure environment-specific JWT settings:
  - Dev: 15m access / 1d refresh (shorter for testing)
  - QA: 15m access / 7d refresh
  - Prod: 30m access / 30d refresh

### Step 2: Update Lambda Construct

Modify [cdk/lib/constructs/core/lambda-construct.ts](cdk/lib/constructs/core/lambda-construct.ts):

- Add JWT environment variables (`JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`, `JWT_SECRET_ID`)
- Grant Secrets Manager permissions for JWT secret alongside existing DB secret

### Step 3: Create JWT Secrets Utility

Create new file `api/layers/shared/nodejs/src/utils/jwt-secrets.ts`:

- Follow the same pattern as [secrets.ts](api/layers/shared/nodejs/src/utils/secrets.ts)
- Implement `getJwtSecrets()` function with caching (5-minute TTL)
- For local development, read from environment variables
- For deployed environments, fetch from Secrets Manager

### Step 4: Update webtoken.ts

Refactor [api/layers/shared/nodejs/src/utils/webtoken.ts](api/layers/shared/nodejs/src/utils/webtoken.ts):

- Make token functions async to support Secrets Manager fetch
- Use the new `getJwtSecrets()` utility
- Add initialization function for pre-warming secrets cache

### Step 5: Update Local Development Files

Update [cdk/env.template.json](cdk/env.template.json) and document required variables:

- Add `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN`
- Update comments with instructions

### Step 6: AWS Secrets Manager Setup (Manual/Documentation)

Document the commands to create secrets in AWS:

```bash
# QA
aws secretsmanager create-secret --name /oriana/qa/jwt \
  --secret-string '{"JWT_SECRET":"<generate-strong-secret>","JWT_REFRESH_SECRET":"<generate-strong-secret>"}'

# Prod
aws secretsmanager create-secret --name /oriana/prod/jwt \
  --secret-string '{"JWT_SECRET":"<generate-strong-secret>","JWT_REFRESH_SECRET":"<generate-strong-secret>"}'
```

## Files to Modify

1. `cdk/lib/config/environment.ts` - Add JWT config interface and per-environment settings
2. `cdk/lib/constructs/core/lambda-construct.ts` - Add JWT env vars and Secrets Manager permissions
3. `api/layers/shared/nodejs/src/utils/jwt-secrets.ts` - New file for JWT secrets management
4. `api/layers/shared/nodejs/src/utils/webtoken.ts` - Refactor to use async secrets loading
5. `api/layers/shared/nodejs/src/index.ts` - Export new jwt-secrets module
6. `cdk/env.template.json` - Add JWT variables for local development

## Security Best Practices Applied

- Secrets never committed to source control
- Secrets fetched at runtime with caching to minimize API calls
- Different secrets per environment (dev/qa/prod isolation)
- Local development uses fallback defaults with clear warnings
- Production enforces secret presence (throws error if missing)