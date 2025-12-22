# GitHub Actions Workflows

This document describes the CI/CD workflows for the Oriana Order Tracking project.

## Workflows Overview

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| 🔍 CI | Push/PR to main/develop | Lint, test, build validation |
| 🚀 Deploy | Manual dispatch | Deploy to dev/qa/prod |
| 🗄️ Database Migration | Manual dispatch | Run Prisma migrations |

---

## 🔍 CI Workflow (`ci.yml`)

**Trigger:** Automatically on push/PR to `main` or `develop` branches.

### What it does:
1. Lints API code (ESLint)
2. Builds API + manifest
3. Builds UI (React)
4. Validates CDK synthesis

### No secrets required - runs on every PR.

---

## 🚀 Deploy Workflow (`deploy.yml`)

**Trigger:** Manual dispatch from GitHub Actions UI.

### Options:

| Input | Options | Description |
|-------|---------|-------------|
| `environment` | dev, qa, prod | Target environment |
| `deploy_type` | full, api-only | What to deploy |
| `skip_ui_build` | true/false | Skip UI build (use existing) |

### Required Secrets:

```
AWS_ACCESS_KEY_ID     - AWS access key
AWS_SECRET_ACCESS_KEY - AWS secret key
AWS_REGION            - AWS region (default: ap-south-1)
```

### Usage:

1. Go to **Actions** tab in GitHub
2. Select **🚀 Deploy** workflow
3. Click **Run workflow**
4. Select environment and deploy type
5. Click **Run workflow** (green button)

### Production Deployment:

Production deployments require an additional approval step. Set up a GitHub Environment called `production-approval` with required reviewers.

### Deployment Summary:

After deployment completes, the workflow generates a summary with:

- **🔗 API URL** - Direct link to your API Gateway endpoint
- **🌐 Website URL** - CloudFront distribution URL (if UI was deployed)
- **📋 Deployment Details** - Environment, branch, commit, triggering user
- **🧪 Quick Test** - Ready-to-use curl command to test the API

The summary is visible in the **Actions** tab → Select the workflow run → Scroll down to see the summary.

---

## 🗄️ Database Migration Workflow (`db-migrate.yml`)

**Trigger:** Manual dispatch from GitHub Actions UI.

### Options:

| Input | Options | Description |
|-------|---------|-------------|
| `environment` | dev, qa, prod | Target database |
| `migration_action` | deploy, status | Apply or check status |
| `confirm_prod` | Text input | Type "MIGRATE-PROD" for production |

### Required Secrets:

```
# For all environments
AWS_ACCESS_KEY_ID     - AWS access key
AWS_SECRET_ACCESS_KEY - AWS secret key
AWS_REGION            - AWS region

# For dev (Neon/Supabase)
DATABASE_URL_DEV      - postgresql://user:pass@host:5432/db

# For qa (Neon/Supabase)  
DATABASE_URL_QA       - postgresql://user:pass@host:5432/db

# For prod (AWS RDS)
# No additional secrets needed - fetched from AWS Secrets Manager
```

### Usage:

#### Check Migration Status (Safe)
1. Select **🗄️ Database Migration** workflow
2. Choose environment
3. Select **status** action
4. Run workflow

#### Apply Migrations
1. Select **🗄️ Database Migration** workflow
2. Choose environment
3. Select **deploy** action
4. For production: Type **MIGRATE-PROD** in confirmation field
5. Run workflow

---

## Setting Up Secrets

### In GitHub Repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:

```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
DATABASE_URL_DEV     (optional, for dev migrations)
DATABASE_URL_QA      (optional, for qa migrations)
```

### AWS IAM Permissions Required:

The AWS credentials need these permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "s3:*",
        "lambda:*",
        "apigateway:*",
        "iam:*",
        "logs:*",
        "secretsmanager:*",
        "rds:*",
        "ec2:*",
        "cloudfront:*",
        "ecr:*",
        "ssm:*",
        "sts:AssumeRole"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Note:** For production, use more restrictive permissions scoped to specific resources.

---

## Setting Up GitHub Environments

### For Production Approval:

1. Go to **Settings** → **Environments**
2. Create environment: `production-approval`
3. Enable **Required reviewers**
4. Add team members who can approve production deployments

### For Environment-Specific Secrets:

1. Create environments: `dev`, `qa`, `prod`
2. Add environment-specific secrets if needed

---

## Typical Deployment Flow

### New Feature:

```
1. Create feature branch
2. Develop & commit
3. Push → CI runs automatically
4. Create PR → CI runs on PR
5. Merge to develop
6. Manual: Deploy to dev (Actions → Deploy → dev)
7. Test on dev
8. Manual: Deploy to qa (Actions → Deploy → qa)
9. QA testing
10. Merge to main
11. Manual: Deploy to prod (Actions → Deploy → prod)
```

### Schema Change:

```
1. Edit schema.prisma locally
2. Run: npm run db:migrate (creates migration)
3. Test locally
4. Commit migration files
5. Push to develop
6. Manual: Migrate dev (Actions → DB Migration → dev)
7. Test on dev
8. Manual: Migrate qa (Actions → DB Migration → qa)
9. Merge to main
10. Manual: Migrate prod (Actions → DB Migration → prod, confirm: MIGRATE-PROD)
```

---

## Troubleshooting

### "Resource not found" during deployment

- Check AWS credentials have correct permissions
- Verify AWS_REGION is correct
- Run CDK bootstrap: `npx cdk bootstrap`

### "Migration failed" 

- Check DATABASE_URL secret is correct
- For prod: Verify RDS is deployed and accessible
- Check security groups allow GitHub Actions IPs

### "Permission denied"

- Verify AWS IAM policy has required permissions
- Check if environment protection rules are blocking

---

*Last updated: December 2025*

