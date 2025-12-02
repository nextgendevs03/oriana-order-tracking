<!-- cabb97e6-482f-4f8f-9784-178f4bf8a2c3 aa30458f-622c-4530-be9d-0d4dbc6e09a6 -->
# Decorator-Based Routing System

## Architecture Overview

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

## New Folder Structure

```
api/
├── src/
│   ├── decorators/                    # NEW: Custom decorator library
│   │   ├── index.ts                   # Export all decorators
│   │   ├── controller.decorator.ts   # @Controller
│   │   ├── http.decorator.ts         # @Get, @Post, @Put, @Delete
│   │   ├── param.decorator.ts        # @Param, @Query, @Body, @Event
│   │   ├── metadata.ts               # Metadata keys & types
│   │   └── registry.ts               # Route registry (collects routes)
│   ├── core/                          # NEW: Core routing engine
│   │   ├── router.ts                 # Route matching & dispatch
│   │   └── parameter-resolver.ts     # Resolve @Param, @Query, @Body
│   ├── controllers/
│   │   └── POController.ts           # Refactored with decorators
│   └── handlers/
│       └── po.handler.ts             # Uses router instead of manual dispatch
├── scripts/
│   └── generate-manifest.ts          # Build script to generate manifest
└── app-manifest.json                  # Generated route manifest
```

## Decorator Examples

### Controller Definition

```typescript
@Controller('/api/po')
@injectable()
export class POController {
  
  @Post('/')
  async create(@Body() data: CreatePORequest): Promise<POResponse> { }
  
  @Get('/')
  async getAll(@Query('page') page: number, @Query('limit') limit: number): Promise<POListResponse> { }
  
  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<POResponse> { }
  
  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdatePORequest): Promise<POResponse> { }
  
  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<DeleteResponse> { }
}
```

## app-manifest.json Structure

```json
{
  "version": "1.0",
  "lambdas": {
    "po": {
      "handler": "dist/handlers/po.handler.handler",
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

## Key Implementation Details

### 1. Decorators (using reflect-metadata)

- `@Controller(basePath)` - Marks class as controller, sets base path
- `@Get(path)`, `@Post(path)`, `@Put(path)`, `@Delete(path)` - HTTP method decorators
- `@Param(name)` - Extract path parameter
- `@Query(name)` - Extract query parameter  
- `@Body()` - Parse JSON body
- `@Event()` - Get raw APIGatewayProxyEvent (for advanced use)
- `@Validate(schema)` - Validate request (future)

### 2. Build Script (generate-manifest.ts)

- Uses TypeScript compiler API to scan controllers
- Reads decorator metadata via reflect-metadata
- Generates `app-manifest.json`
- Runs as: `npm run build:manifest`

### 3. CDK Integration

- Reads `app-manifest.json` during synth
- Dynamically creates API Gateway routes
- Supports multiple Lambdas from manifest

### 4. Runtime Router

- Handler imports router
- Router matches request to controller method
- Parameter resolver injects @Param, @Query, @Body values
- Returns response

## Extensibility for Future Decorators

The decorator system is designed to be extensible:

```typescript
// Future: Queue handler decorator
@SQSHandler('order-queue')
async processOrder(@Message() message: OrderMessage) { }

// Future: Scheduled event
@Schedule('rate(1 hour)')
async cleanup() { }

// Future: WebSocket
@WebSocket('$connect')
async onConnect(@ConnectionId() connectionId: string) { }
```

## Files to Create/Modify

1. `api/src/decorators/*` - All decorator implementations
2. `api/src/core/router.ts` - Runtime route dispatcher
3. `api/src/core/parameter-resolver.ts` - Parameter injection
4. `api/scripts/generate-manifest.ts` - Manifest generator
5. `api/src/controllers/POController.ts` - Refactor with decorators
6. `api/src/handlers/po.handler.ts` - Use router
7. `cdk/lib/stacks/api-stack.ts` - Read manifest for routes
8. `api/package.json` - Add build:manifest script

### To-dos

- [ ] Create shared Lambda Layer with Sequelize, Secrets Manager, utilities
- [ ] Create Sequelize models for PurchaseOrder and POItem
- [ ] Implement PO Lambda with Inversify CSR pattern (Controller/Service/Repository)
- [ ] Create request/response schemas and validation
- [ ] Create Sequelize migrations for database tables
- [ ] Create CDK stacks with environment-specific configuration
- [ ] Configure SAM CLI for local development with hot reload
- [ ] Update README with setup and run commands
- [ ] Create shared Lambda Layer with Sequelize, Secrets Manager, utilities
- [ ] Create Sequelize models for PurchaseOrder and POItem
- [ ] Implement PO Lambda with Inversify CSR pattern (Controller/Service/Repository)
- [ ] Create request/response schemas and validation
- [ ] Create Sequelize migrations for database tables
- [ ] Create CDK stacks with environment-specific configuration
- [ ] Configure SAM CLI for local development with hot reload
- [ ] Update README with setup and run commands