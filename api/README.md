# Oriana Order Tracking - API

Backend API for Oriana Order Tracking built with AWS Lambda, TypeScript, Inversify, and Sequelize.

## Performance Optimizations

- **esbuild**: ~100x faster builds than tsc (~50ms vs 5s)
- **Connection Pooling**: Optimized for Lambda (max 2 connections, 5s idle timeout)
- **Container Reuse**: Singleton pattern for DB connections across warm invocations
- **Secrets Caching**: 5-minute cache reduces Secrets Manager calls
- **ARM64**: Lambda uses ARM architecture for better price-performance
- **Tree Shaking**: Removes unused code from bundle

## Architecture

The API follows the **Controller-Service-Repository (CSR)** pattern with **Inversify** for dependency injection and **custom decorators** for route definition.

```
src/
├── controllers/       # Route controllers with @Controller, @Get, @Post decorators
├── services/          # Business logic, transaction management
├── repositories/      # Database operations
├── models/            # Sequelize models
├── schemas/           # Request/Response TypeScript interfaces
├── decorators/        # Custom routing decorators
├── core/              # Router and parameter resolver
├── types/             # Inversify symbols
├── container/         # DI container configurations
└── handlers/          # Lambda entry points
```

## Decorator-Based Routing

Routes are defined using decorators on controller methods:

```typescript
@Controller('/api/po')
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
| `@Controller(path)` | Marks class as controller, sets base path |
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
      "handler": "dist/handlers/po.handler.handler",
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

# Build shared layer
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
| `npm run build` | Fast build with esbuild (~50ms) |
| `npm run build:tsc` | TypeScript compilation (slower) |
| `npm run build:manifest` | Generate app-manifest.json from decorators |
| `npm run watch` | Watch mode with esbuild (hot reload) |
| `npm run build:layer` | Build shared Lambda layer |
| `npm run build:all` | Build layer + API + manifest |
| `npm run clean` | Remove dist folder and manifest |
| `npm run rebuild` | Clean + build all |
| `npm run migrate` | Run database migrations |
| `npm run migrate:undo` | Undo last migration |
| `npm run lint` | Run ESLint |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |

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

## Adding New Controllers

1. Create controller in `src/controllers/`:

```typescript
@Controller({ path: '/api/dispatch', lambdaName: 'dispatch' })
@injectable()
export class DispatchController {
  @Get('/')
  async getAll(): Promise<DispatchListResponse> { }
}
```

2. Add import to `scripts/generate-manifest.ts`:
```typescript
import '../src/controllers/DispatchController';
```

3. Create handler in `src/handlers/dispatch.handler.ts`

4. Create container in `src/container/dispatch.container.ts`

5. Rebuild:
```bash
npm run build:all
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
