# Step-by-Step Guide: Creating a New Lambda Function

This guide will walk you through creating a complete new Lambda function from scratch, including database schema, models, services, controllers, and testing. We'll use a **User** entity as an example throughout this guide.

---

## Table of Contents

1. [Overview](#overview)
2. [Step 1: Create Database Migration](#step-1-create-database-migration)
3. [Step 2: Generate Model Files](#step-2-generate-model-files)
4. [Step 3: Create Types and Symbols](#step-3-create-types-and-symbols)
5. [Step 4: Create Request/Response Schemas](#step-4-create-requestresponse-schemas)
6. [Step 5: Create Repository](#step-5-create-repository)
7. [Step 6: Create Service](#step-6-create-service)
8. [Step 7: Create Controller](#step-7-create-controller)
9. [Step 8: Create Container](#step-8-create-container)
10. [Step 9: Create Handler](#step-9-create-handler)
11. [Step 10: Update Build Configuration](#step-10-update-build-configuration)
12. [Step 11: Update Manifest Generator](#step-11-update-manifest-generator)
13. [Step 12: Build and Generate Manifest](#step-12-build-and-generate-manifest)
14. [Step 13: Run Migrations](#step-13-run-migrations)
15. [Step 14: Test with Postman](#step-14-test-with-postman)

---

## Overview

A Lambda function in this project follows the **Controller-Service-Repository (CSR)** pattern with Dependency Injection. Here's the architecture:

```
API Gateway Event
    ↓
Handler (Lambda entry point)
    ↓
Router (from shared layer)
    ↓
Controller (HTTP decorators)
    ↓
Service (Business logic)
    ↓
Repository (Data access)
    ↓
Model (Sequelize ORM)
    ↓
Database (PostgreSQL)
```

**Key Components:**
- **Handler**: Lambda entry point that initializes container and routes requests
- **Container**: Dependency Injection container (Inversify)
- **Controller**: HTTP endpoints with decorators (`@Get`, `@Post`, etc.)
- **Service**: Business logic layer
- **Repository**: Data access layer
- **Model**: Sequelize model definition
- **Schema**: Request/Response TypeScript interfaces
- **Types**: Dependency Injection symbols

---

## Step 1: Create Database Migration

Migrations define your database schema. They are version-controlled and run in order.

### 1.1 Create Migration File

Navigate to `api/migrations/` and create a new migration file. The naming convention is:
```
YYYYMMDDHHMMSS-create-{table-name}.js
```

**Example:** `20241203120000-create-users.js`

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: Sequelize.STRING(100),
        allowNull: false,
        field: 'last_name',
      },
      role: {
        type: Sequelize.STRING(50),
        allowNull: false,
        defaultValue: 'user',
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at',
      },
    });

    // Add indexes for better query performance
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['is_active']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
```

### 1.2 Migration Best Practices

- Use `field` property to map camelCase TypeScript properties to snake_case database columns
- Always include `createdAt` and `updatedAt` timestamps
- Add indexes on frequently queried columns
- Use UUID for primary keys (recommended)
- Use appropriate data types (STRING, INTEGER, BOOLEAN, DATE, TEXT, etc.)

---

## Step 2: Generate Model Files

Models are Sequelize ORM definitions that map to your database tables.

### 2.1 Create Model File

Create `api/src/models/User.ts`:

```typescript
import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  // Model attributes
  declare id: CreationOptional<string>;
  declare email: string;
  declare firstName: string;
  declare lastName: string;
  declare role: string;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Static method to initialize the model
  static initModel(sequelize: Sequelize): typeof User {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
        },
        firstName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'first_name',
        },
        lastName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'last_name',
        },
        role: {
          type: DataTypes.STRING(50),
          allowNull: false,
          defaultValue: 'user',
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'users',
        timestamps: true,
        underscored: true,
      }
    );

    return User;
  }

  // Static method to define associations (if any)
  static associate(): void {
    // Example: User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
  }
}
```

### 2.2 Update Models Index

Update `api/src/models/index.ts` to export your new model:

```typescript
import { Sequelize } from 'sequelize';
import { PurchaseOrder } from './PurchaseOrder';
import { POItem } from './POItem';
import { User } from './User'; // Add this import

export { PurchaseOrder } from './PurchaseOrder';
export { POItem } from './POItem';
export { User } from './User'; // Add this export

let modelsInitialized = false;

export const initializeModels = (sequelize: Sequelize): void => {
  if (modelsInitialized) {
    return;
  }

  // Initialize all models
  PurchaseOrder.initModel(sequelize);
  POItem.initModel(sequelize);
  User.initModel(sequelize); // Add this line

  // Setup associations
  PurchaseOrder.associate();
  POItem.associate();
  User.associate(); // Add this line

  modelsInitialized = true;
};

export const getModels = () => ({
  PurchaseOrder,
  POItem,
  User, // Add this export
});
```

### 2.3 Model Best Practices

- Use `InferAttributes` and `InferCreationAttributes` for type safety
- Use `CreationOptional` for fields that are auto-generated (id, timestamps)
- Always include `initModel` static method
- Always include `associate` static method (even if empty)
- Use `field` property to map camelCase to snake_case
- Set `tableName` explicitly
- Set `underscored: true` for snake_case column names

---

## Step 3: Create Types and Symbols

Types file defines Dependency Injection symbols used by Inversify.

### 3.1 Update Types File

Update `api/src/types/types.ts`:

```typescript
export const TYPES = {
  // Controllers
  POController: Symbol.for('POController'),
  UserController: Symbol.for('UserController'), // Add this

  // Services
  POService: Symbol.for('POService'),
  UserService: Symbol.for('UserService'), // Add this

  // Repositories
  PORepository: Symbol.for('PORepository'),
  UserRepository: Symbol.for('UserRepository'), // Add this

  // Database
  Sequelize: Symbol.for('Sequelize'),
};
```

### 3.2 Types Best Practices

- Use `Symbol.for()` to ensure symbols are consistent across modules
- Follow naming convention: `{EntityName}Controller`, `{EntityName}Service`, `{EntityName}Repository`
- Keep all symbols in one file for easy reference

---

## Step 4: Create Request/Response Schemas

Schemas define TypeScript interfaces for API requests and responses.

### 4.1 Create Request Schema

Create `api/src/schemas/request/UserRequest.ts`:

```typescript
export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  isActive?: boolean;
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: string;
}

export interface GetUserByIdRequest {
  id: string;
}

export interface DeleteUserRequest {
  id: string;
}

export interface ListUserRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  email?: string;
  role?: string;
  isActive?: boolean;
}
```

### 4.2 Create Response Schema

Create `api/src/schemas/response/UserResponse.ts`:

```typescript
export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserListResponse {
  items: UserResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface DeleteUserResponse {
  id: string;
  deleted: boolean;
}
```

### 4.3 Update Schemas Index

Update `api/src/schemas/index.ts`:

```typescript
// Request schemas
export * from './request/PORequest';
export * from './request/UserRequest'; // Add this

// Response schemas
export * from './response/POResponse';
export * from './response/UserResponse'; // Add this
```

### 4.4 Schema Best Practices

- Use `Partial<>` for update requests
- Always include `id` in update/delete requests
- Include pagination metadata in list responses
- Use ISO string format for dates in responses
- Make optional fields explicit with `?`

---

## Step 5: Create Repository

Repository handles all database operations (CRUD).

### 5.1 Create Repository File

Create `api/src/repositories/UserRepository.ts`:

```typescript
import { injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { User } from '../models';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ListUserRequest,
} from '../schemas';

export interface IUserRepository {
  create(data: CreateUserRequest, transaction?: Transaction): Promise<User>;
  findById(id: string): Promise<User | null>;
  findAll(params: ListUserRequest): Promise<{ rows: User[]; count: number }>;
  update(
    id: string,
    data: UpdateUserRequest,
    transaction?: Transaction
  ): Promise<User | null>;
  delete(id: string, transaction?: Transaction): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
}

@injectable()
export class UserRepository implements IUserRepository {
  async create(
    data: CreateUserRequest,
    transaction?: Transaction
  ): Promise<User> {
    return User.create(
      {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'user',
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
      { transaction }
    );
  }

  async findById(id: string): Promise<User | null> {
    return User.findByPk(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }

  async findAll(
    params: ListUserRequest
  ): Promise<{ rows: User[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      email,
      role,
      isActive,
    } = params;

    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (email) {
      where.email = { $iLike: `%${email}%` };
    }
    if (role) {
      where.role = role;
    }
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    return User.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });
  }

  async update(
    id: string,
    data: UpdateUserRequest,
    transaction?: Transaction
  ): Promise<User | null> {
    const user = await User.findByPk(id, { transaction });

    if (!user) {
      return null;
    }

    const updateData: Partial<User> = {};
    if (data.email !== undefined) updateData.email = data.email;
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.role !== undefined) updateData.role = data.role;
    if (data.isActive !== undefined) updateData.isActive = data.isActive;

    await user.update(updateData, { transaction });

    return user.reload({ transaction });
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const deleted = await User.destroy({ where: { id }, transaction });
    return deleted > 0;
  }
}
```

### 5.2 Repository Best Practices

- Always implement an interface (`IUserRepository`)
- Use `@injectable()` decorator for DI
- Accept optional `Transaction` parameter for database transactions
- Use `findAndCountAll` for paginated lists
- Use `$iLike` for case-insensitive search (PostgreSQL)
- Return `null` when entity not found (for single entity queries)
- Return `boolean` for delete operations

---

## Step 6: Create Service

Service contains business logic and orchestrates repository calls.

### 6.1 Create Service File

Create `api/src/services/UserService.ts`:

```typescript
import { injectable, inject } from 'inversify';
import { Sequelize } from 'sequelize';
import { TYPES } from '../types/types';
import { IUserRepository } from '../repositories/UserRepository';
import { User } from '../models';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ListUserRequest,
  UserResponse,
  UserListResponse,
} from '../schemas';

export interface IUserService {
  createUser(data: CreateUserRequest): Promise<UserResponse>;
  getUserById(id: string): Promise<UserResponse | null>;
  getAllUsers(params: ListUserRequest): Promise<UserListResponse>;
  updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse | null>;
  deleteUser(id: string): Promise<boolean>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
    @inject(TYPES.Sequelize) private sequelize: Sequelize
  ) {}

  private mapToResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const transaction = await this.sequelize.transaction();

    try {
      const user = await this.userRepository.create(data, transaction);
      await transaction.commit();
      return this.mapToResponse(user);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await this.userRepository.findById(id);
    return user ? this.mapToResponse(user) : null;
  }

  async getAllUsers(params: ListUserRequest): Promise<UserListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.userRepository.findAll(params);

    return {
      items: rows.map((user) => this.mapToResponse(user)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateUser(
    id: string,
    data: UpdateUserRequest
  ): Promise<UserResponse | null> {
    const transaction = await this.sequelize.transaction();

    try {
      // If email is being updated, check for duplicates
      if (data.email) {
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser && existingUser.id !== id) {
          throw new Error('User with this email already exists');
        }
      }

      const user = await this.userRepository.update(id, data, transaction);
      if (!user) {
        await transaction.rollback();
        return null;
      }
      await transaction.commit();
      return this.mapToResponse(user);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    const transaction = await this.sequelize.transaction();

    try {
      const deleted = await this.userRepository.delete(id, transaction);
      await transaction.commit();
      return deleted;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
```

### 6.2 Service Best Practices

- Always implement an interface (`IUserService`)
- Use `@injectable()` and `@inject()` decorators for DI
- Use transactions for operations that modify data
- Map database models to response DTOs in a private method
- Handle business logic (e.g., duplicate email check)
- Always rollback transactions on error
- Return `null` when entity not found

---

## Step 7: Create Controller

Controller defines HTTP endpoints using decorators.

### 7.1 Create Controller File

Create `api/src/controllers/UserController.ts`:

```typescript
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
  ValidationError,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IUserService } from '../services/UserService';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ListUserRequest,
} from '../schemas';

export interface IUserController {
  create(data: CreateUserRequest): Promise<APIGatewayProxyResult>;
  getAll(
    page?: string,
    limit?: string,
    sortBy?: string,
    sortOrder?: string,
    email?: string,
    role?: string,
    isActive?: string
  ): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateUserRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/users', lambdaName: 'user' })
@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  @Post('/')
  async create(@Body() data: CreateUserRequest): Promise<APIGatewayProxyResult> {
    this.validateCreateRequest(data);
    const user = await this.userService.createUser(data);
    return createSuccessResponse(user, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('email') email?: string,
    @Query('role') role?: string,
    @Query('isActive') isActive?: string
  ): Promise<APIGatewayProxyResult> {
    const params: ListUserRequest = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      email,
      role,
      isActive: isActive ? isActive === 'true' : undefined,
    };

    const result = await this.userService.getAllUsers(params);
    return createSuccessResponse(result.items, 200, result.pagination);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const user = await this.userService.getUserById(id);

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return createSuccessResponse(user);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserRequest
  ): Promise<APIGatewayProxyResult> {
    const updateData = { ...data, id };
    const user = await this.userService.updateUser(id, updateData);

    if (!user) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return createSuccessResponse(user);
  }

  @Delete('/{id}')
  async delete(id: string): Promise<APIGatewayProxyResult> {
    const deleted = await this.userService.deleteUser(id);

    if (!deleted) {
      throw new NotFoundError(`User with ID ${id} not found`);
    }

    return createSuccessResponse({ id, deleted: true });
  }

  private validateCreateRequest(data: CreateUserRequest): void {
    const requiredFields: (keyof CreateUserRequest)[] = [
      'email',
      'firstName',
      'lastName',
    ];

    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null || data[field] === '') {
        throw new ValidationError(`Field '${field}' is required`);
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new ValidationError('Invalid email format');
    }
  }
}
```

### 7.2 Controller Best Practices

- Use `@Controller` decorator with `path` and `lambdaName`
- Use `@injectable()` and `@inject()` for DI
- Use HTTP method decorators: `@Get`, `@Post`, `@Put`, `@Delete`
- Use parameter decorators: `@Param`, `@Query`, `@Body`
- Validate request data in private methods
- Use `createSuccessResponse` for successful responses
- Throw `NotFoundError` when entity not found
- Throw `ValidationError` for invalid input
- Convert query string parameters to appropriate types

---

## Step 8: Create Container

Container sets up Dependency Injection bindings.

### 8.1 Create Container File

Create `api/src/container/user.container.ts`:

```typescript
import 'reflect-metadata';
import { Container } from 'inversify';
import { Sequelize } from 'sequelize';
import { TYPES } from '../types/types';
import { UserController } from '../controllers/UserController';
import { UserService, IUserService } from '../services/UserService';
import { UserRepository, IUserRepository } from '../repositories/UserRepository';
import { getSequelize, logger } from '@oriana/shared';
import { initializeModels } from '../models';

let container: Container | null = null;
let sequelizeInstance: Sequelize | null = null;

export const createContainer = async (): Promise<Container> => {
  if (container && sequelizeInstance) {
    try {
      await sequelizeInstance.authenticate({ logging: false });
      return container;
    } catch (error) {
      logger.warn('Container connection unhealthy, recreating...');
      container = null;
      sequelizeInstance = null;
    }
  }

  const startTime = Date.now();
  container = new Container({ defaultScope: 'Singleton' });

  sequelizeInstance = await getSequelize();
  initializeModels(sequelizeInstance);

  // Bind Sequelize instance
  container.bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelizeInstance);

  // Bind Repository
  container
    .bind<IUserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

  // Bind Service
  container
    .bind<IUserService>(TYPES.UserService)
    .to(UserService)
    .inSingletonScope();

  // Bind Controller
  container.bind<UserController>(UserController).toSelf().inSingletonScope();

  const duration = Date.now() - startTime;
  logger.info(`DI container created in ${duration}ms`);

  return container;
};

export const getContainer = (): Container => {
  if (!container) {
    throw new Error('Container not initialized. Call createContainer() first.');
  }
  return container;
};

export const resetContainer = (): void => {
  container = null;
  sequelizeInstance = null;
};
```

### 8.2 Container Best Practices

- Reuse container and sequelize instance (singleton pattern)
- Check connection health before reusing
- Bind in order: Sequelize → Repository → Service → Controller
- Use `inSingletonScope()` for all bindings
- Use `toConstantValue()` for Sequelize instance
- Initialize models before binding

---

## Step 9: Create Handler

Handler is the Lambda entry point that receives API Gateway events.

### 9.1 Create Handler File

Create `api/src/handlers/user.handler.ts`:

```typescript
import 'reflect-metadata';
import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { createContainer } from '../container/user.container';
import { createRouter, Router, logger, createErrorResponse, handleOptions } from '@oriana/shared';

// Import controller to register decorators
import '../controllers/UserController';

// Initialize outside handler for container reuse (Lambda best practice)
let isInitialized = false;
let initPromise: Promise<void> | null = null;
let initError: Error | null = null;
let router: Router | null = null;

const LAMBDA_NAME = 'user';

const initialize = async (): Promise<void> => {
  // Fast path: already initialized
  if (isInitialized) {
    return;
  }

  // If previous initialization failed, throw the error
  if (initError) {
    throw initError;
  }

  // If initialization is in progress, wait for it
  if (initPromise) {
    await initPromise;
    return;
  }

  // Start new initialization
  initPromise = (async () => {
    const startTime = Date.now();
    logger.info('Initializing Lambda container and DB connection...');

    try {
      // Create DI container
      const container = await createContainer();

      // Create router for this lambda
      router = createRouter(container, LAMBDA_NAME);

      isInitialized = true;

      const duration = Date.now() - startTime;
      logger.info(`Lambda container initialized in ${duration}ms`);
    } catch (error) {
      initError = error as Error;
      throw error;
    }
  })();

  await initPromise;
};

// Trigger initialization on cold start (OUTSIDE handler)
initialize().catch((error) => {
  logger.error('Failed to initialize during cold start', error);
});

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  logger.setContext({
    requestId: context.awsRequestId,
    functionName: context.functionName,
  });

  const startTime = Date.now();
  logger.info('Incoming request', {
    method: event.httpMethod,
    path: event.path,
    pathParameters: event.pathParameters,
  });

  try {
    await initialize();

    if (!router) {
      throw new Error('Router not initialized');
    }

    const response = await router.handleRequest(event, context);

    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      statusCode: response.statusCode,
      duration: `${duration}ms`,
    });

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error('Unhandled error in handler', { error, duration: `${duration}ms` });
    return createErrorResponse(error as Error);
  } finally {
    logger.clearContext();
  }
};
```

### 9.2 Handler Best Practices

- Import controller to trigger decorator registration
- Initialize container outside handler for reuse (cold start optimization)
- Use singleton pattern for router
- Handle OPTIONS requests for CORS
- Set `callbackWaitsForEmptyEventLoop = false` for faster responses
- Log request/response for debugging
- Handle errors gracefully with `createErrorResponse`
- Use `LAMBDA_NAME` constant matching controller's `lambdaName`

---

## Step 10: Update Build Configuration

Update esbuild config to include your new handler.

### 10.1 Update esbuild.config.js

Update `api/esbuild.config.js`:

```javascript
const esbuild = require('esbuild');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// Plugin to rewrite @oriana/shared imports to /opt/nodejs/dist (Lambda layer path)
const sharedLayerPlugin = {
  name: 'shared-layer-alias',
  setup(build) {
    build.onResolve({ filter: /^@oriana\/shared/ }, (args) => {
      if (args.path === '@oriana/shared') {
        return { path: '/opt/nodejs/dist', external: true };
      }
      const subpath = args.path.replace('@oriana/shared/', '');
      return { path: `/opt/nodejs/dist/${subpath}`, external: true };
    });
  },
};

const buildOptions = {
  // Add your new handler here
  entryPoints: [
    'src/handlers/po.handler.ts',
    'src/handlers/user.handler.ts', // Add this line
  ],
  bundle: true,
  platform: 'node',
  target: 'node22',
  outdir: 'dist/handlers', // Use outdir for multiple handlers
  format: 'cjs',
  sourcemap: true,
  minify: false,
  tsconfigRaw: JSON.stringify({
    compilerOptions: {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    },
  }),
  external: [
    '@aws-sdk/*',
    '/opt/nodejs/*',
  ],
  plugins: [sharedLayerPlugin],
  treeShaking: true,
  metafile: true,
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      const result = await esbuild.build(buildOptions);
      
      if (result.metafile) {
        const outputs = Object.entries(result.metafile.outputs);
        for (const [file, info] of outputs) {
          const sizeKB = (info.bytes / 1024).toFixed(2);
          console.log(`${file}: ${sizeKB} KB`);
        }
      }
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
```

### 10.2 Build Configuration Best Practices

- Add all handlers to `entryPoints` array
- Use `outdir` when building multiple handlers
- Keep sourcemap enabled for debugging
- Don't minify in development

---

## Step 11: Update Manifest Generator

Update the manifest generator to include your new controller.

### 11.1 Update generate-manifest.ts

Update `api/scripts/generate-manifest.ts`:

```typescript
#!/usr/bin/env ts-node
/**
 * Manifest Generator Script
 *
 * Scans all controllers with decorators and generates app-manifest.json
 * This file is read by CDK during synth to create API Gateway routes.
 */

import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';

// Import decorators from shared layer
import { routeRegistry, AppManifest } from '@oriana/shared';

// Import all controllers to trigger decorator registration
// Add new controllers here as they are created
import '../src/controllers/POController';
import '../src/controllers/UserController'; // Add this line

async function generateManifest(): Promise<void> {
  console.log('🔍 Scanning controllers for routes...\n');

  // Generate manifest from registry
  const manifest: AppManifest = routeRegistry.generateManifest();

  // Log discovered routes
  for (const [lambdaName, lambda] of Object.entries(manifest.lambdas)) {
    console.log(`📦 Lambda: ${lambdaName}`);
    console.log(`   Handler: ${lambda.handler}`);
    console.log(`   Controller: ${lambda.controller}`);
    console.log('   Routes:');

    for (const route of lambda.routes) {
      console.log(`     ${route.method.padEnd(7)} ${route.path} → ${route.action}()`);
    }
    console.log('');
  }

  // Write manifest file
  const outputPath = path.join(__dirname, '..', 'app-manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));

  console.log(`✅ Generated: ${outputPath}`);
  console.log(`   Version: ${manifest.version}`);
  console.log(`   Lambdas: ${Object.keys(manifest.lambdas).length}`);
  console.log(
    `   Total Routes: ${Object.values(manifest.lambdas).reduce((sum, l) => sum + l.routes.length, 0)}`
  );
}

// Run the generator
generateManifest().catch((error) => {
  console.error('❌ Failed to generate manifest:', error);
  process.exit(1);
});
```

### 11.2 Manifest Generator Best Practices

- Import all controllers to trigger decorator registration
- The manifest is auto-generated from decorators
- CDK reads this file to create API Gateway routes

---

## Step 12: Build and Generate Manifest

Build your code and generate the manifest.

### 12.1 Build Commands

Run these commands in the `api/` directory:

```bash
# Build the shared layer (if not already built)
npm run build:layer

# Build all handlers
npm run build

# Generate manifest from controllers
npm run build:manifest

# Or build everything at once
npm run build:all
```

### 12.2 Verify Build Output

Check that files were created:

```bash
# Verify handler was built
ls dist/handlers/user.js

# Verify manifest was generated
cat app-manifest.json
```

The manifest should include your new lambda:

```json
{
  "version": "1.0",
  "generatedAt": "2024-12-03T12:00:00.000Z",
  "lambdas": {
    "po": { ... },
    "user": {
      "handler": "dist/handlers/user.handler",
      "controller": "UserController",
      "routes": [
        {
          "method": "POST",
          "path": "/api/users",
          "controller": "UserController",
          "action": "create"
        },
        {
          "method": "GET",
          "path": "/api/users",
          "controller": "UserController",
          "action": "getAll"
        },
        {
          "method": "GET",
          "path": "/api/users/{id}",
          "controller": "UserController",
          "action": "getById"
        },
        {
          "method": "PUT",
          "path": "/api/users/{id}",
          "controller": "UserController",
          "action": "update"
        },
        {
          "method": "DELETE",
          "path": "/api/users/{id}",
          "controller": "UserController",
          "action": "delete"
        }
      ]
    }
  }
}
```

---

## Step 13: Run Migrations

Run database migrations to create your tables.

### 13.1 Run Migration

```bash
# Run all pending migrations
npm run migrate

# Check migration status
npx sequelize-cli db:migrate:status
```

### 13.2 Migration Commands

```bash
# Run migrations
npm run migrate

# Rollback last migration
npm run migrate:undo

# Rollback all migrations
npm run migrate:undo:all
```

### 13.3 Verify Migration

Check your database to ensure the table was created:

```sql
-- PostgreSQL
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'users';
```

---

## Step 14: Test with Postman

Test your Lambda function using Postman or any HTTP client.

### 14.1 Local Development Setup

If using SAM Local:

```bash
# Start SAM Local API
sam local start-api

# Or start a specific function
sam local start-api --port 3000
```

### 14.2 Postman Test Cases

#### Create User (POST)

**Request:**
```
POST http://localhost:3000/api/users
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "admin",
  "isActive": true
}
```

**Expected Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "admin",
    "isActive": true,
    "createdAt": "2024-12-03T12:00:00.000Z",
    "updatedAt": "2024-12-03T12:00:00.000Z"
  }
}
```

#### Get All Users (GET)

**Request:**
```
GET http://localhost:3000/api/users?page=1&limit=10&sortBy=createdAt&sortOrder=DESC
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-here",
      "email": "john.doe@example.com",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

#### Get User by ID (GET)

**Request:**
```
GET http://localhost:3000/api/users/{id}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    ...
  }
}
```

#### Update User (PUT)

**Request:**
```
PUT http://localhost:3000/api/users/{id}
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith"
}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "email": "john.doe@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    ...
  }
}
```

#### Delete User (DELETE)

**Request:**
```
DELETE http://localhost:3000/api/users/{id}
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "deleted": true
  }
}
```

### 14.3 Error Testing

Test error scenarios:

1. **Validation Error**: Send invalid email
2. **Not Found**: Get/Update/Delete non-existent ID
3. **Duplicate Email**: Create user with existing email

---

## Summary Checklist

Use this checklist to ensure you've completed all steps:

- [ ] ✅ Created database migration file
- [ ] ✅ Created model file and updated `models/index.ts`
- [ ] ✅ Added types/symbols to `types/types.ts`
- [ ] ✅ Created request schema
- [ ] ✅ Created response schema
- [ ] ✅ Updated `schemas/index.ts`
- [ ] ✅ Created repository with interface
- [ ] ✅ Created service with interface
- [ ] ✅ Created controller with decorators
- [ ] ✅ Created container file
- [ ] ✅ Created handler file
- [ ] ✅ Updated `esbuild.config.js`
- [ ] ✅ Updated `scripts/generate-manifest.ts`
- [ ] ✅ Built handlers (`npm run build`)
- [ ] ✅ Generated manifest (`npm run build:manifest`)
- [ ] ✅ Ran migrations (`npm run migrate`)
- [ ] ✅ Tested all endpoints in Postman

---

## Common Issues and Solutions

### Issue: Handler not found
**Solution**: Check that handler is in `esbuild.config.js` entryPoints and built successfully.

### Issue: Routes not appearing in manifest
**Solution**: Ensure controller is imported in `generate-manifest.ts` and has `@Controller` decorator.

### Issue: Container binding errors
**Solution**: Verify all symbols are defined in `types/types.ts` and match injection tokens.

### Issue: Database connection errors
**Solution**: Check database configuration in `config/database.js` and environment variables.

### Issue: Model not found
**Solution**: Ensure model is initialized in `models/index.ts` and `initializeModels()` is called.

---

## Next Steps

After creating your Lambda:

1. **Add Tests**: Create unit tests for repository, service, and controller
2. **Add Validation**: Enhance request validation
3. **Add Authentication**: Add auth middleware if needed
4. **Add Logging**: Add detailed logging for debugging
5. **Deploy**: Deploy to AWS using CDK

---

## Additional Resources

- [Sequelize Documentation](https://sequelize.org/docs/v6/)
- [Inversify Documentation](https://inversify.io/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [API Gateway Documentation](https://docs.aws.amazon.com/apigateway/)

---

**Happy Coding! 🚀**

