# Creating a New Lambda

This guide explains how to create a new Lambda function in the Oriana Order Tracking API.

## Overview

The API uses a streamlined Lambda creation system that automates container setup and handler generation. You only need to create the business logic files - the framework handles the rest.

## Prerequisites

Before creating a new Lambda, ensure you have:

- Node.js 22.x installed
- Dependencies installed (`npm install` in the api folder)
- Shared layer built (`npm run build:layer`)
- Prisma client generated (`npm run db:generate`)

## Step-by-Step Guide

### Step 1: Create Schema Files

Create request/response schemas in `src/schemas/`:

```typescript
// src/schemas/request/DispatchRequest.ts
export interface CreateDispatchRequest {
  poId: string;
  dispatchDate: string;
  carrier: string;
  trackingNumber?: string;
}

export interface UpdateDispatchRequest {
  dispatchDate?: string;
  carrier?: string;
  trackingNumber?: string;
  status?: string;
}

export interface ListDispatchRequest {
  page?: number;
  limit?: number;
  poId?: string;
  status?: string;
}
```

```typescript
// src/schemas/response/DispatchResponse.ts
export interface DispatchResponse {
  id: string;
  poId: string;
  dispatchDate: string;
  carrier: string;
  trackingNumber: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DispatchListResponse {
  items: DispatchResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

Update `src/schemas/index.ts`:

```typescript
export * from './request/PORequest';
export * from './request/DispatchRequest';  // Add this
export * from './response/POResponse';
export * from './response/DispatchResponse';  // Add this
```

### Step 2: Add Prisma Model (if new table needed)

If your Lambda needs a new database table, add the model to `layers/shared/nodejs/prisma/schema.prisma`:

```prisma
model Dispatch {
  id              String        @id @default(uuid())
  purchaseOrderId String        @map("purchase_order_id")
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id])
  dispatchDate    DateTime      @map("dispatch_date") @db.Date
  carrier         String        @db.VarChar(100)
  trackingNumber  String?       @map("tracking_number") @db.VarChar(100)
  status          String        @default("pending") @db.VarChar(50)
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  @@index([purchaseOrderId])
  @@index([status])
  @@map("dispatches")
}
```

Then run:
```bash
npm run db:migrate    # Creates migration and updates database
npm run db:generate   # Regenerates Prisma client with new types
```

### Step 3: Create Repository

Create the data access layer in `src/repositories/`:

```typescript
// src/repositories/DispatchRepository.ts
import { injectable, inject } from 'inversify';
import { PrismaClient, Dispatch, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateDispatchRequest, UpdateDispatchRequest, ListDispatchRequest } from '../schemas';

export interface IDispatchRepository {
  create(data: CreateDispatchRequest): Promise<Dispatch>;
  findById(id: string): Promise<Dispatch | null>;
  findAll(params: ListDispatchRequest): Promise<{ rows: Dispatch[]; count: number }>;
  update(id: string, data: UpdateDispatchRequest): Promise<Dispatch | null>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class DispatchRepository implements IDispatchRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateDispatchRequest): Promise<Dispatch> {
    return this.prisma.dispatch.create({
      data: {
        purchaseOrderId: data.poId,
        dispatchDate: new Date(data.dispatchDate),
        carrier: data.carrier,
        trackingNumber: data.trackingNumber,
        status: 'pending',
      },
    });
  }

  async findById(id: string): Promise<Dispatch | null> {
    return this.prisma.dispatch.findUnique({ where: { id } });
  }

  async findAll(params: ListDispatchRequest): Promise<{ rows: Dispatch[]; count: number }> {
    const { page = 1, limit = 10, poId, status } = params;
    const skip = (page - 1) * limit;
    
    const where: Prisma.DispatchWhereInput = {};
    if (poId) where.purchaseOrderId = poId;
    if (status) where.status = status;

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.dispatch.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.dispatch.count({ where }),
    ]);

    return { rows, count };
  }

  async update(id: string, data: UpdateDispatchRequest): Promise<Dispatch | null> {
    const existing = await this.prisma.dispatch.findUnique({ where: { id } });
    if (!existing) return null;
    
    return this.prisma.dispatch.update({
      where: { id },
      data: {
        ...(data.dispatchDate && { dispatchDate: new Date(data.dispatchDate) }),
        ...(data.carrier && { carrier: data.carrier }),
        ...(data.trackingNumber !== undefined && { trackingNumber: data.trackingNumber }),
        ...(data.status && { status: data.status }),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.dispatch.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
```

### Step 4: Create Service

Create business logic layer in `src/services/`:

```typescript
// src/services/DispatchService.ts
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IDispatchRepository } from '../repositories/DispatchRepository';
import { CreateDispatchRequest, UpdateDispatchRequest, ListDispatchRequest, DispatchResponse, DispatchListResponse } from '../schemas';

export interface IDispatchService {
  createDispatch(data: CreateDispatchRequest): Promise<DispatchResponse>;
  getDispatchById(id: string): Promise<DispatchResponse | null>;
  getAllDispatches(params: ListDispatchRequest): Promise<DispatchListResponse>;
  updateDispatch(id: string, data: UpdateDispatchRequest): Promise<DispatchResponse | null>;
  deleteDispatch(id: string): Promise<boolean>;
}

@injectable()
export class DispatchService implements IDispatchService {
  constructor(@inject(TYPES.DispatchRepository) private repository: IDispatchRepository) {}

  async createDispatch(data: CreateDispatchRequest): Promise<DispatchResponse> {
    const dispatch = await this.repository.create(data);
    return this.mapToResponse(dispatch);
  }

  async getDispatchById(id: string): Promise<DispatchResponse | null> {
    const dispatch = await this.repository.findById(id);
    return dispatch ? this.mapToResponse(dispatch) : null;
  }

  async getAllDispatches(params: ListDispatchRequest): Promise<DispatchListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.repository.findAll(params);

    return {
      items: rows.map((d) => this.mapToResponse(d)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateDispatch(id: string, data: UpdateDispatchRequest): Promise<DispatchResponse | null> {
    const dispatch = await this.repository.update(id, data);
    return dispatch ? this.mapToResponse(dispatch) : null;
  }

  async deleteDispatch(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private mapToResponse(dispatch: any): DispatchResponse {
    return {
      id: dispatch.id,
      poId: dispatch.purchaseOrderId,
      dispatchDate: dispatch.dispatchDate.toISOString().split('T')[0],
      carrier: dispatch.carrier,
      trackingNumber: dispatch.trackingNumber,
      status: dispatch.status,
      createdAt: dispatch.createdAt.toISOString(),
      updatedAt: dispatch.updatedAt.toISOString(),
    };
  }
}
```

### Step 5: Create Controller

Create the API endpoint handler in `src/controllers/`:

```typescript
// src/controllers/DispatchController.ts
import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  createSuccessResponse,
  NotFoundError,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IDispatchService } from '../services/DispatchService';
import { CreateDispatchRequest, UpdateDispatchRequest } from '../schemas';

@Controller({ path: '/api/dispatch', lambdaName: 'dispatch' })
@injectable()
export class DispatchController {
  constructor(@inject(TYPES.DispatchService) private dispatchService: IDispatchService) {}

  @Post('/')
  async create(@Body() data: CreateDispatchRequest): Promise<APIGatewayProxyResult> {
    const dispatch = await this.dispatchService.createDispatch(data);
    return createSuccessResponse(dispatch, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('poId') poId?: string,
    @Query('status') status?: string
  ): Promise<APIGatewayProxyResult> {
    const result = await this.dispatchService.getAllDispatches({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      poId,
      status,
    });
    return createSuccessResponse(result.items, 200, result.pagination);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const dispatch = await this.dispatchService.getDispatchById(id);
    if (!dispatch) {
      throw new NotFoundError(`Dispatch with ID ${id} not found`);
    }
    return createSuccessResponse(dispatch);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateDispatchRequest
  ): Promise<APIGatewayProxyResult> {
    const dispatch = await this.dispatchService.updateDispatch(id, data);
    if (!dispatch) {
      throw new NotFoundError(`Dispatch with ID ${id} not found`);
    }
    return createSuccessResponse(dispatch);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const deleted = await this.dispatchService.deleteDispatch(id);
    if (!deleted) {
      throw new NotFoundError(`Dispatch with ID ${id} not found`);
    }
    return createSuccessResponse({ id, deleted: true });
  }
}
```

### Step 6: Update TYPES

Add symbols for the new services in `src/types/types.ts`:

```typescript
export const TYPES = {
  // Existing
  POController: Symbol.for('POController'),
  POService: Symbol.for('POService'),
  PORepository: Symbol.for('PORepository'),
  PrismaClient: Symbol.for('PrismaClient'),

  // New - Add these
  DispatchController: Symbol.for('DispatchController'),
  DispatchService: Symbol.for('DispatchService'),
  DispatchRepository: Symbol.for('DispatchRepository'),
};
```

### Step 7: Export Controller

Add the controller export in `src/controllers/index.ts`:

```typescript
export * from './POController';
export * from './DispatchController';  // Add this
```

### Step 8: Create Lambda Config

Create the Lambda configuration file in `src/lambdas/`:

```typescript
// src/lambdas/dispatch.lambda.ts
import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';
import { DispatchController } from '../controllers/DispatchController';
import { DispatchService } from '../services/DispatchService';
import { DispatchRepository } from '../repositories/DispatchRepository';

// Define and register the lambda configuration
defineLambda({
  name: 'dispatch',
  controller: DispatchController,
  bindings: [
    { symbol: TYPES.DispatchService, implementation: DispatchService },
    { symbol: TYPES.DispatchRepository, implementation: DispatchRepository },
  ],
  prismaSymbol: TYPES.PrismaClient,
});

// Export the Lambda handler
export const handler = createLambdaHandler('dispatch');
```

### Step 9: Build and Deploy

```bash
# Build the shared layer (if you made changes)
npm run build:layer

# Build all lambdas (auto-discovers from src/lambdas/)
npm run build

# Generate the API manifest
npm run build:manifest

# Or build everything at once
npm run build:all

# Deploy with CDK
cd ../cdk
npm run deploy:dev
```

## File Structure Summary

After creating a new Lambda, your file structure should look like:

```
api/
├── src/
│   ├── controllers/
│   │   ├── index.ts              # Export all controllers here
│   │   ├── POController.ts
│   │   └── DispatchController.ts # New
│   ├── services/
│   │   ├── POService.ts
│   │   └── DispatchService.ts    # New
│   ├── repositories/
│   │   ├── PORepository.ts
│   │   └── DispatchRepository.ts # New
│   ├── schemas/
│   │   ├── index.ts              # Export new schemas
│   │   ├── request/
│   │   │   ├── PORequest.ts
│   │   │   └── DispatchRequest.ts  # New
│   │   └── response/
│   │       ├── POResponse.ts
│   │       └── DispatchResponse.ts # New
│   ├── types/
│   │   └── types.ts              # Add new TYPES symbols
│   └── lambdas/
│       ├── po.lambda.ts
│       └── dispatch.lambda.ts    # New
├── layers/
│   └── shared/
│       └── nodejs/
│           └── prisma/
│               └── schema.prisma # Add new models here
└── app-manifest.json             # Auto-generated
```

## Quick Checklist

- [ ] Create schema files (request/response)
- [ ] Update `src/schemas/index.ts` exports
- [ ] Add Prisma model to `layers/shared/nodejs/prisma/schema.prisma` (if new table)
- [ ] Run `npm run db:migrate` and `npm run db:generate`
- [ ] Create repository
- [ ] Create service
- [ ] Create controller with `@Controller` decorator
- [ ] Add symbols to `src/types/types.ts`
- [ ] Export controller from `src/controllers/index.ts`
- [ ] Create lambda config in `src/lambdas/`
- [ ] Run `npm run build:all`
- [ ] Deploy with CDK

## Available Decorators

| Decorator | Description |
|-----------|-------------|
| `@Controller({ path, lambdaName })` | Marks class as controller |
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

## Troubleshooting

### Lambda not appearing in manifest

1. Ensure the controller has `@Controller` decorator with `lambdaName`
2. Ensure controller is exported from `src/controllers/index.ts`
3. Run `npm run build:manifest`

### Build fails with "Cannot find module"

1. Ensure all imports are correct
2. Run `npm run build:layer` first
3. Run `npm run db:generate` to generate Prisma client
4. Check `tsconfig.json` paths

### DI container errors

1. Ensure all services/repositories have `@injectable()` decorator
2. Ensure symbols are added to `types.ts`
3. Ensure bindings are listed in the lambda config

### Prisma errors

1. Ensure DATABASE_URL is set in environment
2. Run `npm run db:generate` after schema changes
3. Run `npm run db:migrate` to apply schema changes to database
