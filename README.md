# Oriana Order Tracking

A full-stack order tracking application with React frontend and AWS Lambda serverless backend.

## 🏗️ Architecture

This project uses a **decorator-based routing system** similar to NestJS, with automatic API Gateway route generation from TypeScript decorators.

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Controllers    │ ──► │  Build Script    │ ──► │ app-manifest.json│
│  @Get, @Post    │     │  (scan & extract)│     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  API Gateway    │ ◄── │  CDK Stack       │ ◄── │ app-manifest.json│
│  Routes         │     │  (read manifest) │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

## 📁 Project Structure

```
oriana-order-tracking/
├── api/                        # Backend API (AWS Lambda)
│   ├── layers/shared/          # Shared Lambda Layer
│   │   └── nodejs/src/
│   │       ├── decorators/     # @Controller, @Get, @Post, etc.
│   │       ├── core/           # Router & parameter resolver
│   │       ├── database/       # Sequelize connection
│   │       └── middleware/     # Error handling, CORS
│   ├── src/
│   │   ├── controllers/        # Route controllers
│   │   ├── services/           # Business logic
│   │   ├── repositories/       # Database operations
│   │   ├── models/             # Sequelize models
│   │   └── handlers/           # Lambda entry points
│   ├── migrations/             # Database migrations
│   └── ARCHITECTURE.md         # Detailed backend documentation
├── cdk/                        # AWS CDK Infrastructure
│   └── lib/
│       ├── stacks/             # CDK stacks
│       └── constructs/         # Reusable constructs
├── ui/                         # React Frontend
└── .husky/                     # Git hooks
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: AWS Lambda (Node.js 22.x, ARM64)
- **Language**: TypeScript
- **DI**: Inversify
- **ORM**: Sequelize
- **Database**: PostgreSQL (Supabase local, RDS prod)
- **Infrastructure**: AWS CDK

### Frontend
- **Framework**: React 18
- **State**: Redux Toolkit
- **UI**: Ant Design
- **Routing**: React Router

### Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged

## 🚀 Quick Start

### Prerequisites

- Node.js 22.x
- Docker Desktop
- AWS CLI configured
- AWS SAM CLI

### Installation

```bash
# Clone repository
git clone <repo-url>
cd oriana-order-tracking

# Install root dependencies (Husky)
npm install

# Install API dependencies
cd api && npm install

# Install CDK dependencies
cd ../cdk && npm install

# Build everything
cd ../api && npm run build:all
```

### Local Development

**Terminal 1 - API Watch Mode**
```bash
cd api
npm run watch
```

**Terminal 2 - Local Lambda API**
```bash
cd cdk
# Edit env.json with your Supabase credentials
npm run dev
```

**Terminal 3 - React UI**
```bash
cd ui
npm start
```

### Database Setup

```bash
cd api

# Create .env from example
cp .env.example .env
# Edit with your database credentials

# Run migrations
npm run migrate
```

## 📖 Documentation

- **[Backend Architecture](./api/ARCHITECTURE.md)** - Detailed backend documentation
- **[API README](./api/README.md)** - API specific documentation
- **[CDK README](./cdk/Readme.md)** - Infrastructure documentation

## 🔧 Development Commands

### API (api/)

| Command | Description |
|---------|-------------|
| `npm run build:all` | Build layer + API + manifest |
| `npm run watch` | Watch mode (hot reload) |
| `npm run build:manifest` | Generate route manifest |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format with Prettier |
| `npm run migrate` | Run DB migrations |
| `npm run test` | Run tests |

### CDK (cdk/)

| Command | Description |
|---------|-------------|
| `npm run dev` | Build + Synth + Start local API |
| `npm run dev:quick` | Quick start (skip build) |
| `npm run synth:dev` | Synthesize dev stack |
| `npm run deploy:dev` | Deploy to dev |
| `npm run deploy:prod` | Deploy to production |

### Root

| Command | Description |
|---------|-------------|
| `npm run lint` | Lint all workspaces |
| `npm run format` | Format all workspaces |
| `npm run build` | Build API + CDK |

## 🔒 Code Quality

### Pre-commit Hooks

Husky runs these checks before each commit:

1. ESLint checks
2. Prettier formatting
3. TypeScript compilation

```bash
# Setup Husky (already done by npm install)
npm run prepare
```

### Manual Checks

```bash
# Run linting
npm run lint

# Run formatting
npm run format

# Check formatting without fixing
npm run format:check
```

## 🚢 Deployment

### Deploy to AWS

```bash
cd cdk

# First time - bootstrap CDK
npm run bootstrap

# Deploy to environment
npm run deploy:dev    # Development
npm run deploy:qa     # QA
npm run deploy:prod   # Production
```

### Environment Configuration

| Environment | Stack | Database | Memory |
|-------------|-------|----------|--------|
| dev | ApiStack-dev | Supabase | 256 MB |
| qa | ApiStack-qa | RDS | 512 MB |
| prod | ApiStack-prod | RDS | 1024 MB |

## 🔄 Adding New Features

### Adding New Routes

1. Add decorator to controller:
```typescript
@Get('/new-route')
async newRoute(@Param('id') id: string) { }
```

2. Rebuild:
```bash
cd api && npm run build:manifest
cd ../cdk && npm run synth:dev
```

### Adding New Controllers

See [ARCHITECTURE.md](./api/ARCHITECTURE.md#adding-new-controllers)

## 📦 Reusing This Infrastructure

This architecture can be reused in other projects. See the [Reusing This Infrastructure](./api/ARCHITECTURE.md#reusing-this-infrastructure) section in the architecture documentation.

## 📄 License

MIT
