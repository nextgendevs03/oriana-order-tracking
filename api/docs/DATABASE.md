# Database Management with Prisma

This document describes the database setup and management using Prisma ORM.

## Overview

The Oriana Order Tracking API uses **Prisma** as its ORM (Object-Relational Mapping) tool. Prisma provides:

- **Type-safe database queries** - All queries are type-checked at compile time
- **Auto-generated types** - No manual model files needed
- **Migration management** - Version-controlled database schema changes
- **Single source of truth** - Schema defined in one place (`schema.prisma`)

## Project Structure

```
api/
├── layers/
│   └── shared/
│       └── nodejs/
│           ├── prisma/
│           │   ├── schema.prisma      # Database schema definition
│           │   └── migrations/        # Auto-generated migration files
│           └── node_modules/
│               └── .prisma/
│                   └── client/        # Generated Prisma Client
└── package.json                       # Contains db: scripts
```

## Schema Location

The Prisma schema is located in the **shared layer** to centralize database access:

```
api/layers/shared/nodejs/prisma/schema.prisma
```

## Available Commands

Run these from the `api/` directory:

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate/regenerate Prisma Client after schema changes |
| `npm run db:migrate` | Create and apply a new migration (development) |
| `npm run db:migrate:prod` | Apply pending migrations (production) |
| `npm run db:push` | Push schema changes directly (skip migrations, dev only) |
| `npm run db:studio` | Open Prisma Studio GUI for database browsing |

## Environment Variables

Prisma requires a `DATABASE_URL` environment variable. The shared layer builds this from:

**For Local Development:**
```bash
# Set in .env or environment
DB_HOST=localhost
DB_PORT=5432
DB_NAME=oriana
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_SSL=false
IS_LOCAL=true
```

**For AWS (Lambda):**
- Credentials are fetched from AWS Secrets Manager
- Set `DB_SECRET_ID` to the secret ARN/name
- Set `DB_SSL=true` for secure connections

## Schema Definition

### Example Model

```prisma
model PurchaseOrder {
  id                    String    @id @default(uuid())
  date                  DateTime  @db.Date
  clientName            String    @map("client_name") @db.VarChar(255)
  poStatus              String    @map("po_status") @db.VarChar(50)
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  // Relations
  poItems               POItem[]

  // Indexes
  @@index([clientName])
  @@index([poStatus])
  
  // Table name mapping
  @@map("purchase_orders")
}
```

### Key Decorators

| Decorator | Description |
|-----------|-------------|
| `@id` | Primary key |
| `@default(uuid())` | Auto-generate UUID |
| `@default(now())` | Default to current timestamp |
| `@updatedAt` | Auto-update on modification |
| `@map("column_name")` | Map to different column name |
| `@@map("table_name")` | Map to different table name |
| `@db.VarChar(255)` | Specify database column type |
| `@@index([field])` | Create database index |
| `@relation(...)` | Define relationships |

### Relationships

```prisma
// One-to-Many
model PurchaseOrder {
  id      String   @id @default(uuid())
  poItems POItem[]  // Has many POItems
}

model POItem {
  id              String        @id @default(uuid())
  purchaseOrderId String        @map("purchase_order_id")
  purchaseOrder   PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)
}
```

## Workflow

### Adding a New Table

1. **Edit the schema:**
   ```prisma
   // layers/shared/nodejs/prisma/schema.prisma
   model NewTable {
     id        String   @id @default(uuid())
     name      String   @db.VarChar(100)
     createdAt DateTime @default(now()) @map("created_at")
     
     @@map("new_tables")
   }
   ```

2. **Create and apply migration:**
   ```bash
   npm run db:migrate
   # Enter a migration name when prompted, e.g., "add-new-table"
   ```

3. **Regenerate client (automatic with migrate, but run manually if needed):**
   ```bash
   npm run db:generate
   ```

4. **Use in code:**
   ```typescript
   import { PrismaClient } from '@prisma/client';
   
   const prisma = new PrismaClient();
   const records = await prisma.newTable.findMany();
   ```

### Modifying an Existing Table

1. **Edit the schema** (add/modify fields)

2. **Create migration:**
   ```bash
   npm run db:migrate
   ```

3. **Regenerate client:**
   ```bash
   npm run db:generate
   ```

### Quick Prototyping (No Migration)

For rapid development, push changes directly:

```bash
npm run db:push
```

> **Warning:** This skips migrations and may cause data loss. Use only in development.

## Using Prisma in Code

### Basic Queries

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create
const po = await prisma.purchaseOrder.create({
  data: {
    date: new Date(),
    clientName: 'ACME Corp',
    poStatus: 'pending',
  },
});

// Read
const orders = await prisma.purchaseOrder.findMany({
  where: { poStatus: 'pending' },
  include: { poItems: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Update
await prisma.purchaseOrder.update({
  where: { id: 'uuid-here' },
  data: { poStatus: 'completed' },
});

// Delete
await prisma.purchaseOrder.delete({
  where: { id: 'uuid-here' },
});
```

### Transactions

```typescript
// Sequential operations in a transaction
const result = await prisma.$transaction([
  prisma.purchaseOrder.create({ data: { ... } }),
  prisma.pOItem.createMany({ data: [...] }),
]);

// Interactive transaction
const result = await prisma.$transaction(async (tx) => {
  const po = await tx.purchaseOrder.create({ data: { ... } });
  await tx.pOItem.create({
    data: { purchaseOrderId: po.id, ... },
  });
  return po;
});
```

### Filtering

```typescript
// Case-insensitive search
const orders = await prisma.purchaseOrder.findMany({
  where: {
    clientName: { contains: 'acme', mode: 'insensitive' },
  },
});

// Multiple conditions
const orders = await prisma.purchaseOrder.findMany({
  where: {
    AND: [
      { poStatus: 'pending' },
      { clientName: { contains: 'corp' } },
    ],
  },
});
```

## Lambda Integration

The shared layer provides a Lambda-optimized Prisma client:

```typescript
import { getPrismaClient } from '@oriana/shared';

// In your repository
const prisma = await getPrismaClient();
const orders = await prisma.purchaseOrder.findMany();
```

Features:
- **Connection pooling** - Reuses connections across warm Lambda invocations
- **Lazy initialization** - Only connects when first query is made
- **Health checks** - Validates connection is still alive

## Prisma Studio

For visual database exploration:

```bash
npm run db:studio
```

This opens a web interface at `http://localhost:5555` where you can:
- Browse all tables and records
- Create, update, delete records
- View relationships
- Run filters

## Best Practices

1. **Always use migrations in production** - Never use `db:push` in prod
2. **Review generated migrations** - Check SQL before applying
3. **Use descriptive migration names** - e.g., "add-dispatch-tracking-fields"
4. **Keep schema organized** - Group related models together
5. **Use `@@map` for table names** - Follow snake_case for database, camelCase in code
6. **Add indexes for frequently queried fields** - Especially foreign keys and filter fields
7. **Use `onDelete: Cascade`** - For child records that should be deleted with parent

## Troubleshooting

### "Cannot find module '@prisma/client'"

```bash
npm run db:generate
```

### "Migration failed"

1. Check DATABASE_URL is correct
2. Ensure database is running
3. Check for conflicting changes

### "Connection refused"

1. Verify database is running
2. Check host/port settings
3. Ensure security groups/firewall allow connection

### Reset database (development only)

```bash
cd layers/shared/nodejs
npx prisma migrate reset
```

> **Warning:** This deletes all data!

