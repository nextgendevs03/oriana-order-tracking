# Oriana Order Tracking - API

Backend API for Oriana Order Tracking built with AWS Lambda, TypeScript, Inversify, and Prisma.

## Performance Optimizations

- **esbuild**: ~100x faster builds than tsc (~50ms vs 5s)
- **Connection Pooling**: Optimized for Lambda (reuses connections across warm invocations)
- **Container Reuse**: Singleton pattern for DB connections across warm invocations
- **Secrets Caching**: 5-minute cache reduces Secrets Manager calls
- **ARM64**: Lambda uses ARM architecture for better price-performance
- **Tree Shaking**: Removes unused code from bundle

## Architecture

The API follows the **Controller-Service-Repository (CSR)** pattern with **Inversify** for dependency injection and **custom decorators** for route definition.

```
src/
├── controllers/       # Route controllers with @Controller, @Get, @Post decorators
│   └── index.ts       # Central export file for all controllers
├── services/          # Business logic
├── repositories/      # Database operations (using Prisma)
├── schemas/           # Request/Response TypeScript interfaces
├── types/             # Inversify symbols
├── lambdas/           # Lambda configuration files (auto-discovered)
│   └── *.lambda.ts    # One file per Lambda function
└── ...

layers/shared/nodejs/  # Shared Lambda layer
├── prisma/
│   └── schema.prisma  # Database schema (single source of truth)
├── src/
│   ├── core/          # Router, handler factory, service registry
│   ├── decorators/    # @Controller, @Get, @Post, etc.
│   ├── database/      # Prisma connection management
│   └── middleware/    # Error handling, CORS
└── ...
```

## Decorator-Based Routing

Routes are defined using decorators on controller methods:

```typescript
@Controller({ path: '/api/po', lambdaName: 'po' })
@injectable()
export class POController {
  
  @Post('/')
  async create(@Body() data: CreatePORequest): Promise<POResponse> { }
  
  @Get('/')
  async getAll(
    @Query('page') page: number,
    @Query('limit') limit: number
  ): Promise<POListResponse> { }
  
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<POResponse> { }
  
  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdatePORequest
  ): Promise<POResponse> { }
  
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<DeleteResponse> { }
}
```

### Available Decorators

| Decorator | Description |
|-----------|-------------|
| `@Controller({ path, lambdaName })` | Marks class as controller, sets base path and lambda name |
| `@Get(path)` | HTTP GET method |
| `@Post(path)` | HTTP POST method |
| `@Put(path)` | HTTP PUT method |
| `@Delete(path)` | HTTP DELETE method |
| `@Patch(path)` | HTTP PATCH method |
| `@Param('name')` | Extract path parameter |
| `@Query('name')` | Extract query parameter |
| `@Body()` | Parse JSON body |
| `@Event()` | Get raw APIGatewayProxyEvent |
| `@Headers()` | Get all headers |
| `@Headers('name')` | Get specific header |

## App Manifest

Routes are extracted at build time into `app-manifest.json`:

```json
{
  "version": "1.0",
  "lambdas": {
    "po": {
      "handler": "dist/handlers/po.handler",
      "routes": [
        { "method": "POST", "path": "/api/po", "controller": "POController", "action": "create" },
        { "method": "GET", "path": "/api/po", "controller": "POController", "action": "getAll" }
      ]
    }
  }
}
```

CDK reads this manifest to automatically create API Gateway routes.

## Prerequisites

- **Node.js 22.x** or later
- **PostgreSQL database** (Supabase for local, RDS for prod)
- **AWS CLI v2** - Required for AWS deployments and SAM CLI
  - [Download AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
  - Configure with `aws configure`
- **AWS SAM CLI** - Required for local Lambda development
  - [Download SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html)
- **Docker** - Required for SAM CLI local development
  - [Download Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Setup

```bash
# Install dependencies
npm install

# Build shared layer (includes Prisma client generation)
npm run build:layer

# Build API
npm run build

# Generate route manifest
npm run build:manifest

# Or build everything at once
npm run build:all
```

## NPM Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Fast build with esbuild (auto-discovers lambdas) |
| `npm run build:tsc` | TypeScript compilation (slower) |
| `npm run build:manifest` | Generate app-manifest.json from decorators |
| `npm run watch` | Watch mode with esbuild (hot reload) |
| `npm run build:layer` | Build shared Lambda layer |
| `npm run build:all` | Build layer + API + manifest |
| `npm run clean` | Remove dist folder and manifest |
| `npm run rebuild` | Clean + build all |
| `npm run db:generate` | Generate Prisma client after schema changes |
| `npm run db:migrate` | Create and apply database migrations |
| `npm run db:migrate:prod` | Apply migrations in production |
| `npm run db:push` | Push schema changes directly (dev only) |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

## Database Management

The API uses **Prisma** as its ORM. The schema is defined in `layers/shared/nodejs/prisma/schema.prisma`.

See **[docs/DATABASE.md](docs/DATABASE.md)** for detailed database management instructions.

### Quick Commands

```bash
# After modifying schema.prisma
npm run db:migrate      # Create and apply migration
npm run db:generate     # Regenerate Prisma client

# Browse database visually
npm run db:studio
```

## Adding New Routes

1. Add a new method to your controller with decorators:

```typescript
@Get('/search')
async search(@Query('q') query: string): Promise<SearchResponse> {
  // Implementation
}
```

2. Rebuild the manifest:
```bash
npm run build:manifest
```

3. Re-synth CDK to update API Gateway:
```bash
cd ../cdk && npm run synth:dev
```

## Creating New Lambda Functions

For detailed instructions on creating a new Lambda function, see **[docs/CREATING_NEW_LAMBDA.md](docs/CREATING_NEW_LAMBDA.md)**.

### Quick Summary

Creating a new Lambda is streamlined - you only need to create the business logic files:

1. **Create** schema, repository, service, and controller files
2. **Update** `src/types/types.ts` with new symbols
3. **Export** controller from `src/controllers/index.ts`
4. **Create** lambda config in `src/lambdas/<name>.lambda.ts`
5. **Run** `npm run build:all`

The build system auto-discovers lambda configurations from `src/lambdas/*.lambda.ts` and generates the handlers automatically.

### Lambda Configuration Example

```typescript
// src/lambdas/dispatch.lambda.ts
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';
import { DispatchController } from '../controllers/DispatchController';
import { DispatchService } from '../services/DispatchService';
import { DispatchRepository } from '../repositories/DispatchRepository';

defineLambda({
  name: 'dispatch',
  controller: DispatchController,
  bindings: [
    { symbol: TYPES.DispatchService, implementation: DispatchService },
    { symbol: TYPES.DispatchRepository, implementation: DispatchRepository },
  ],
  prismaSymbol: TYPES.PrismaClient,
});

export const handler = createLambdaHandler('dispatch');
```

## Extensibility

The decorator system supports future extensions:

```typescript
// Future: Queue handler
@SQSHandler('order-queue')
async processOrder(@Message() message: OrderMessage) { }

// Future: Scheduled event
@Schedule('rate(1 hour)')
async cleanup() { }

// Future: WebSocket
@WebSocket('$connect')
async onConnect(@ConnectionId() connectionId: string) { }
```

## Documentation

- **[Creating New Lambda](docs/CREATING_NEW_LAMBDA.md)** - Step-by-step guide for adding new Lambda functions
- **[Database Management](docs/DATABASE.md)** - Prisma schema, migrations, and queries
- **[Local Development](docs/LOCAL_DEVELOPMENT.md)** - Setting up local development with SAM CLI
- **[Layer Bundling](docs/LAYER_BUNDLING.md)** - How the shared layer is built and bundled
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Overview of the project architecture

## Local Development

See the CDK README for local development setup using SAM CLI.

## Testing

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
```

## Linting

```bash
npm run lint          # Check errors
npm run lint:fix      # Fix errors
```
