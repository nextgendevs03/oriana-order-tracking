# Project Context - Oriana Order Tracking

This document provides comprehensive context about the Oriana Order Tracking application for Cursor AI and developers.

## Project Overview

**Oriana Order Tracking** is a full-stack order tracking application that helps manage purchase orders, users, roles, permissions, products, categories, OEMs, and clients.

### Tech Stack

#### Frontend (`ui/`)

- **Framework**: React 18
- **Language**: TypeScript (strict mode)
- **State Management**: Redux Toolkit + RTK Query
- **UI Library**: Ant Design
- **Routing**: React Router v6
- **Build Tool**: Create React App / Vite
- **Styling**: CSS + Ant Design theme

#### Backend (`api/`)

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: PostgreSQL
- **DI Container**: Inversify
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Controller-Service-Repository (CSR) pattern

## Project Structure

```
oriana-order-tracking/
├── ui/                          # Frontend React application
│   ├── src/
│   │   ├── Components/          # Reusable components
│   │   │   ├── UserManagment/
│   │   │   ├── Admin/
│   │   │   │   ├── RoleManagment/
│   │   │   │   └── PermissionManagment/
│   │   │   └── ProductManagment/
│   │   │       ├── Categories/
│   │   │       ├── Oems/
│   │   │       └── Products/
│   │   ├── pages/               # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CreatePO.tsx
│   │   │   ├── PODetails.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Settings.tsx
│   │   ├── store/               # Redux store
│   │   │   ├── api/             # RTK Query APIs
│   │   │   │   ├── baseApi.ts   # Base API configuration
│   │   │   │   ├── userApi.ts
│   │   │   │   ├── poApi.ts
│   │   │   │   ├── roleApi.ts
│   │   │   │   ├── permissionApi.ts
│   │   │   │   ├── categoryApi.ts
│   │   │   │   ├── oemApi.ts
│   │   │   │   ├── productApi.ts
│   │   │   │   └── clientApi.ts
│   │   │   ├── index.ts         # Store configuration
│   │   │   ├── hooks.ts         # Typed hooks
│   │   │   ├── authSlice.ts
│   │   │   ├── userSlice.ts
│   │   │   ├── poSlice.ts
│   │   │   └── ...
│   │   ├── services/            # Business logic services
│   │   ├── hooks/               # Custom React hooks
│   │   ├── types/               # TypeScript types
│   │   └── styles/              # Global styles
│   └── package.json
│
├── api/                         # Backend API
│   ├── src/
│   │   ├── controllers/         # Route handlers
│   │   │   ├── UserController.ts
│   │   │   ├── POController.ts
│   │   │   ├── RoleController.ts
│   │   │   └── ...
│   │   ├── services/            # Business logic
│   │   │   ├── UserService.ts
│   │   │   ├── POService.ts
│   │   │   └── ...
│   │   ├── repositories/        # Data access layer
│   │   │   ├── UserRepository.ts
│   │   │   ├── PORepository.ts
│   │   │   └── ...
│   │   ├── schemas/             # Request/Response schemas
│   │   │   ├── request/
│   │   │   │   ├── UserRequest.ts
│   │   │   │   ├── PORequest.ts
│   │   │   │   └── ...
│   │   │   └── response/
│   │   │       ├── UserResponse.ts
│   │   │       ├── POResponse.ts
│   │   │       └── ...
│   │   ├── middleware/          # Express middleware
│   │   └── types/               # TypeScript types
│   ├── layers/
│   │   └── shared/
│   │       └── nodejs/
│   │           ├── src/
│   │           │   └── utils/   # Shared utilities
│   │           └── prisma/
│   │               └── schema.prisma  # Prisma schema
│   └── package.json
│
└── README.md
```

## Key Patterns

### API Response Standardization

**All `getAll` APIs MUST return this structure:**

```typescript
{
  data: T[],  // Array of items (NOT 'items')
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}
```

**Request Parameters for `getAll` APIs:**

All list request interfaces extend `BaseListRequest` which includes:

```typescript
// BaseListRequest (api/src/schemas/request/BaseListRequest.ts)
export interface BaseListRequest {
  page?: number; // Default: 1
  limit?: number; // Default: 20
  sortBy?: string; // Field to sort by (e.g., 'createdAt', 'name')
  sortOrder?: "ASC" | "DESC"; // Default: 'DESC'
  searchKey?: string; // Field name to search in (optional)
  searchTerm?: string; // Value to search for (optional)
}

// Example: ListClientRequest extends BaseListRequest
export interface ListClientRequest extends BaseListRequest {
  isActive?: boolean; // Additional filters specific to Client
}
```

**Important**: All searchable fields (like `clientName`, `categoryName`, `userName`, `email`) have been removed from request interfaces. Use `searchKey` and `searchTerm` instead.

### Redux/RTK Query Pattern

**Base API Configuration** (`ui/src/store/api/baseApi.ts`):

- Uses `fetchBaseQuery` with JWT token injection
- Global error handling for 401 (token expiry)
- Redirects to login on unauthorized access
- Retry logic for transient errors

**API Endpoint Pattern**:

```typescript
export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, ListUserRequest>({
      query: (params) => ({
        url: "/users",
        params,
      }),
      transformResponse: (response: UserListResponse) => ({
        data: response.data,
        pagination: response.pagination,
      }),
      providesTags: ["Users"],
    }),
  }),
});
```

**Component Usage**:

```typescript
const { data, isLoading, isError } = useGetUsersQuery({
  page: currentPage,
  limit: pageSize,
  sortBy: "createdAt",
  sortOrder: "DESC",
});

// Access data
const users = data?.data || [];
const pagination = data?.pagination;
```

### Pagination Pattern

**Frontend Implementation**:

```typescript
const [currentPage, setCurrentPage] = useState(1);
const [pageSize] = useState(20);

const { data, isLoading } = useGetItemsQuery({
  page: currentPage,
  limit: pageSize,
});

<Table
  dataSource={data?.data || []}
  loading={isLoading}
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    total: data?.pagination?.total || 0,
    showSizeChanger: false,
    onChange: (page) => setCurrentPage(page),
  }}
/>;
```

**Backend Implementation**:

```typescript
// Repository
async findAll(params?: ListRequest): Promise<{ rows: T[]; count: number }> {
  const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = params || {};
  const skip = (page - 1) * limit;

  const [rows, count] = await this.prisma.$transaction([
    this.prisma.model.findMany({ skip, take: limit, orderBy: { [sortBy]: sortOrder } }),
    this.prisma.model.count(),
  ]);

  return { rows, count };
}

// Service
const { rows, count } = await this.repository.findAll(params);
const totalPages = Math.ceil(count / limit);

return {
  data: rows,
  pagination: { page, limit, total: count, totalPages },
};
```

### Dynamic Search Pattern

**Overview**: All `getAll` APIs support dynamic search functionality using `searchKey` and `searchTerm` parameters. This allows searching on specific fields dynamically with case-insensitive partial matching.

**Base Interface**: All list request interfaces extend `BaseListRequest` which includes common pagination and search fields.

**Search Parameters**:

- `searchKey` (optional): The field/column name to search in (e.g., `'username'`, `'clientName'`, `'email'`)
- `searchTerm` (optional): The value to search for (e.g., `'john'`, `'acme'`, `'john@gmail.com'`)

**Default Search Fields**: When `searchTerm` is provided without `searchKey`, each API automatically uses a default search field:

| API            | Default Search Field | Allowed Search Fields                       |
| -------------- | -------------------- | ------------------------------------------- |
| **User**       | `username`           | `username`, `email`                         |
| **Client**     | `clientName`         | `clientName`                                |
| **PO**         | `poId`               | `poId`, `clientPoNo`, `osgPiNo`, `poStatus` |
| **Product**    | `productName`        | `productName`                               |
| **Category**   | `categoryName`       | `categoryName`                              |
| **OEM**        | `oemName`            | `oemName`                                   |
| **Role**       | `roleName`           | `roleName`                                  |
| **Permission** | `permissionName`     | `permissionName`                            |

**Backend Implementation Pattern**:

```typescript
// 1. Request Schema (extends BaseListRequest)
import { BaseListRequest } from './BaseListRequest';

export interface ListClientRequest extends BaseListRequest {
  isActive?: boolean; // Additional filters
}

// 2. Repository Implementation
// Allowed searchable fields for Client model
const ALLOWED_SEARCH_FIELDS = ['clientName'] as const;
type AllowedSearchField = (typeof ALLOWED_SEARCH_FIELDS)[number];

// Default search field when searchKey is not provided
const DEFAULT_SEARCH_FIELD: AllowedSearchField = 'clientName';

@injectable()
export class ClientRepository implements IClientRepository {
  // Validate if search field is allowed (security)
  private isValidSearchField(field: string): field is AllowedSearchField {
    return ALLOWED_SEARCH_FIELDS.includes(field as AllowedSearchField);
  }

  async findAll(params?: ListClientRequest): Promise<{ rows: ClientResponse[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      isActive,
      searchKey,
      searchTerm,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {};

    // Apply filters
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    // Dynamic search implementation with default field
    if (searchTerm) {
      // If searchKey is provided, use it; otherwise use default
      const fieldToSearch = searchKey || DEFAULT_SEARCH_FIELD;

      // Security: Validate searchKey is in allowed list
      if (!this.isValidSearchField(fieldToSearch)) {
        throw new Error(
          `Invalid search field: ${fieldToSearch}. Allowed fields: ${ALLOWED_SEARCH_FIELDS.join(', ')}`
        );
      }

      // Build dynamic search condition (case-insensitive)
      where[fieldToSearch] = {
        contains: searchTerm,
        mode: 'insensitive',
      };
    }

    // ... rest of query logic
  }
}

// 3. Controller Implementation
@Get('/')
async getAll(
  @Query('page') page?: string,
  @Query('limit') limit?: string,
  @Query('sortBy') sortBy?: string,
  @Query('sortOrder') sortOrder?: string,
  @Query('isActive') isActive?: string,
  @Query('searchKey') searchKey?: string,    // NEW
  @Query('searchTerm') searchTerm?: string   // NEW
): Promise<APIGatewayProxyResult> {
  const result = await this.clientService.getAllClients({
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20,
    sortBy: sortBy || 'createdAt',
    sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
    isActive: isActive ? isActive === 'true' : undefined,
    searchKey: searchKey || undefined,
    searchTerm: searchTerm || undefined,
  });
  return createSuccessResponse(result.data, 200, result.pagination);
}
```

**Frontend Usage**:

```typescript
// Simple search - uses default field (clientName for Client API)
const { data, isLoading } = useGetClientsQuery({
  page: 1,
  limit: 20,
  searchTerm: "acme", // Automatically searches clientName
  isActive: true,
});

// Explicit field search - overrides default
const { data, isLoading } = useGetUsersQuery({
  page: 1,
  limit: 20,
  searchKey: "email", // Explicitly search by email
  searchTerm: "john@gmail.com",
});

// Search with other filters
const { data, isLoading } = useGetProductsQuery({
  page: 1,
  limit: 20,
  searchTerm: "laptop", // Uses default field (productName)
  categoryId: "cat-123",
  isActive: true,
});
```

**Component Example with Search Input**:

```typescript
const [searchTerm, setSearchTerm] = useState<string>("");
const [currentPage, setCurrentPage] = useState(1);

const { data, isLoading } = useGetClientsQuery({
  page: currentPage,
  limit: 20,
  searchTerm: searchTerm || undefined, // Uses default field (clientName)
  isActive: true,
});

return (
  <div>
    <Input.Search
      placeholder="Search clients..."
      value={searchTerm}
      onChange={(e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on new search
      }}
      allowClear
      style={{ width: 300, marginBottom: 16 }}
    />
    <Table
      dataSource={data?.data || []}
      loading={isLoading}
      pagination={{
        current: currentPage,
        pageSize: 20,
        total: data?.pagination?.total || 0,
        onChange: (page) => setCurrentPage(page),
      }}
    />
  </div>
);
```

**Security Considerations**:

1. **Field Whitelisting**: Only allowed fields can be searched (prevents SQL injection-like attacks)
2. **Type Safety**: TypeScript const assertions ensure type safety
3. **Validation**: Invalid `searchKey` values throw clear error messages
4. **Case-Insensitive**: All searches use Prisma's `mode: 'insensitive'`

**Important Notes**:

- ❌ **DO NOT** use old field names like `clientName`, `categoryName`, `userName`, `email` in request parameters
- ✅ **DO** use `searchTerm` for simple searches (uses default field)
- ✅ **DO** use `searchKey` + `searchTerm` for explicit field searches
- ✅ **DO** validate `searchKey` against allowed fields in repositories
- ✅ **DO** use `BaseListRequest` as base interface for all list requests

**Documentation**: See `api/docs/DYNAMIC_SEARCH_IMPLEMENTATION.md` for detailed implementation guide.

### Error Handling Pattern

**Global Error Handling** (`baseApi.ts`):

- Intercepts 401 errors
- Shows error message
- Clears auth token
- Redirects to login page

**Component Error Handling**:

```typescript
const { data, isLoading, isError, error } = useGetItemsQuery();

if (isError) {
  return <Alert message="Error loading data" type="error" />;
}
```

### Form Handling Pattern

**Ant Design Form**:

```typescript
const [form] = Form.useForm();

<Form form={form} onFinish={handleSubmit}>
  <Form.Item
    name="fieldName"
    rules={[{ required: true, message: "Required" }]}
    initialValue={defaultValue}
  >
    <Input />
  </Form.Item>
</Form>;
```

**Default Values**:

- For toggles/switches: Use `initialValue={true}` and `valuePropName="checked"`
- For selects: Use `initialValue` prop
- Always set defaults explicitly

### Database Pattern (Prisma)

**Schema Example**:

```prisma
model User {
  userId      String   @id @default(uuid()) @map("user_id")
  username    String   @unique @db.VarChar(100)
  email       String   @unique @db.VarChar(255)
  roleId      String?  @map("role_id")
  role        Role?    @relation(fields: [roleId], references: [roleId])
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([email])
  @@index([roleId])
  @@map("users")
}
```

**Repository Pattern**:

```typescript
async findAll(params?: ListRequest): Promise<{ rows: T[]; count: number }> {
  const where: Prisma.ModelWhereInput = {};
  // Build where clause from params

  const [rows, count] = await this.prisma.$transaction([
    this.prisma.model.findMany({ where, skip, take: limit, orderBy }),
    this.prisma.model.count({ where }),
  ]);

  return { rows, count };
}
```

## Common Tasks

### Adding a New API Endpoint

1. **Backend**:

   - Add request/response schemas in `schemas/`
   - Add repository method in `repositories/`
   - Add service method in `services/`
   - Add controller endpoint in `controllers/`

2. **Frontend**:
   - Add endpoint to appropriate API file in `store/api/`
   - Use `builder.query` or `builder.mutation`
   - Add TypeScript types
   - Export hook
   - Use hook in component

### Adding Pagination to Existing API

1. Update request schema to extend `BaseListRequest` (includes pagination and search)
2. Update repository to handle pagination
3. Update service to return pagination metadata
4. Update controller to accept query params
5. Update frontend API to pass pagination
6. Update component to use pagination state

### Adding Search to Existing API

1. **Request Schema**: Ensure it extends `BaseListRequest` (already includes `searchKey` and `searchTerm`)
2. **Repository**:
   - Define `ALLOWED_SEARCH_FIELDS` constant
   - Define `DEFAULT_SEARCH_FIELD` constant
   - Add `isValidSearchField()` validation method
   - Implement search logic in `findAll()` method
3. **Controller**: Add `@Query('searchKey')` and `@Query('searchTerm')` parameters
4. **Frontend**: Use `searchTerm` in API queries (automatically uses default field)

### Adding a New Component

1. Create component file in appropriate directory
2. Use Ant Design components
3. Implement loading and error states
4. Use typed hooks (`useAppSelector`, `useAppDispatch`)
5. Follow existing component patterns
6. Add proper TypeScript types

### Database Changes

1. Update Prisma schema: `api/layers/shared/nodejs/prisma/schema.prisma`
2. Create migration: `cd api/layers/shared/nodejs && npx prisma migrate dev`
3. Regenerate client: `cd api/layers/shared/nodejs && npx prisma generate`
4. Update repositories and services
5. Update response schemas if needed

## Authentication & Authorization

- **JWT Tokens**: Stored in `sessionStorage` as `authToken`
- **Token Expiry**: 45 minutes (configurable in `webtoken.ts`)
- **401 Handling**: Global error handler redirects to login
- **Authorization**: Role-based access control (RBAC)

## Important Files

### Frontend

- `ui/src/store/api/baseApi.ts` - Base API configuration, error handling
- `ui/src/store/index.ts` - Redux store configuration
- `ui/src/store/hooks.ts` - Typed Redux hooks
- `ui/src/App.tsx` - Main app component with routing
- `ui/src/index.tsx` - App entry point

### Backend

- `api/layers/shared/nodejs/prisma/schema.prisma` - Database schema
- `api/src/controllers/` - All controllers
- `api/src/services/` - All services
- `api/src/repositories/` - All repositories
- `api/src/schemas/` - Request/Response schemas
- `api/src/schemas/request/BaseListRequest.ts` - Base interface for all list requests (pagination + search)
- `api/docs/DYNAMIC_SEARCH_IMPLEMENTATION.md` - Comprehensive search implementation guide

## Development Workflow

### Quick Start (Recommended)

```bash
# Daily development - uses cached builds for fast startup
cd cdk && npm run dev:fast

# Hot reload mode - for rapid iteration
cd cdk && npm run dev:hot

# After git pull or schema changes - force full rebuild
cd cdk && npm run dev:fast:init
```

### Workflow Steps

1. **Make Changes**: Edit code in appropriate directory
2. **Test Locally**: Run frontend (`npm start` in ui/) and backend (`npm run dev:fast` in cdk/)
3. **Check Types**: Ensure TypeScript compiles
4. **Check Linting**: Run ESLint
5. **Test Functionality**: Test all scenarios
6. **Commit**: Follow commit message conventions

### Optimized Development Scripts

| Script | Description | When to Use |
|--------|-------------|-------------|
| `dev:fast` | Cached build + SAM | Daily development |
| `dev:hot` | Watch mode + SAM | Rapid iteration |
| `dev:fast:init` | Force rebuild | After git pull or schema changes |

See `api/docs/LOCAL_DEVELOPMENT.md` for detailed documentation.

## Code Quality Standards

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with TypeScript rules
- **Formatting**: Prettier
- **Types**: Always use proper types, avoid `any`
- **Error Handling**: Always handle errors
- **Loading States**: Always show loading indicators
- **Consistency**: Follow existing patterns

## Key Principles

1. **Consistency**: Follow existing patterns and conventions
2. **Type Safety**: Use TypeScript types everywhere
3. **Error Handling**: Always handle errors gracefully
4. **User Experience**: Show loading states and error messages
5. **Performance**: Use server-side pagination, caching
6. **Security**: Validate inputs, use JWT, implement authorization
7. **Maintainability**: Write clean, readable, well-documented code

## Notes

- All API responses use `data` key (not `items`)
- All pagination info is in `pagination` object (not `meta`)
- Default page limit is 20
- Server-side pagination is required for all list endpoints
- All components must handle loading and error states
- TypeScript strict mode is enabled
- JWT tokens expire after 45 minutes
- Global error handler redirects to login on 401
- **Search**: All list requests extend `BaseListRequest` with `searchKey` and `searchTerm` parameters
- **Search**: Use `searchTerm` for simple searches (uses default field automatically)
- **Search**: Use `searchKey` + `searchTerm` for explicit field searches
- **Search**: All searches are case-insensitive and use partial matching
- **Search**: Field validation is required - only whitelisted fields can be searched
- **Local Dev**: Use `dev:fast` for cached builds, `dev:hot` for hot reload - see `api/docs/LOCAL_DEVELOPMENT.md`
- **Layer Caching**: Shared layer builds are cached; use `build:layer:force` to force rebuild
