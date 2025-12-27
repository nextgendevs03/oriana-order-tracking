# Cursor AI Quick Reference Guide

Quick reference for common tasks and patterns in this project.

## Common Prompt Templates

### Adding a New API Endpoint

```
@ui/src/store/api/userApi.ts
@ui/src/store/api/baseApi.ts

Add a new endpoint [endpointName] to [apiFile]:
- Method: [GET/POST/PUT/DELETE]
- URL: [endpoint-url]
- Request type: [RequestType]
- Response type: [ResponseType]
- Include pagination: [yes/no]
- Cache tags: [TagName]

Follow the same pattern as [existingEndpoint] in this file.
```

### Adding Pagination to Component

```
@ui/src/pages/Dashboard.tsx
@ui/src/Components/UserManagment/UserManagment.tsx

Add server-side pagination to [ComponentName]:
- Use [useGetXQuery] hook
- Page limit: 20
- Show loading state
- Handle errors
- Update table pagination props

Follow the same pattern as UserManagment.tsx.
```

### Creating a New Component

```
@ui/src/Components/[SimilarComponent]/[SimilarComponent].tsx

Create a new component [ComponentName] in [directory]:
- Use Ant Design components
- Implement loading and error states
- Use [useGetXQuery] for data fetching
- Add proper TypeScript types
- Follow the same structure as [SimilarComponent]

Requirements:
- [Requirement 1]
- [Requirement 2]
```

### Fixing TypeScript Errors

```
@file-with-error.tsx

Fix TypeScript errors in this file:
- Error: [error message]
- Line: [line number]
- Ensure proper types are used
- Check for null/undefined handling
- Verify imports are correct
```

### Updating Database Schema

```
@api/layers/shared/nodejs/prisma/schema.prisma

Add [field/relation] to [Model] model:
- Field: [fieldName]: [type]
- Required: [yes/no]
- Default: [value if any]
- Relations: [if any]

Then:
1. Create migration
2. Update repository
3. Update service
4. Update response schema
```

## File Reference Shortcuts

### Frontend

- `@ui/src/store/api/baseApi.ts` - Base API config
- `@ui/src/store/index.ts` - Redux store
- `@ui/src/store/hooks.ts` - Typed hooks
- `@ui/src/Components/UserManagment/UserManagment.tsx` - Example component with pagination
- `@ui/src/pages/Dashboard.tsx` - Example page

### Backend

- `@api/src/controllers/UserController.ts` - Example controller
- `@api/src/services/UserService.ts` - Example service
- `@api/src/repositories/UserRepository.ts` - Example repository
- `@api/layers/shared/nodejs/prisma/schema.prisma` - Database schema

## Common Patterns

### RTK Query Query Endpoint

```typescript
getItems: builder.query<ListResponse, ListRequest | void>({
  query: (params) => ({
    url: "/items",
    method: "GET",
    params: params || {},
  }),
  transformResponse: (response: ApiResponse<Item[]>) => ({
    data: response.data || [],
    pagination: response.pagination || defaultPagination,
  }),
  providesTags: ["Item"],
}),
```

### RTK Query Mutation Endpoint

```typescript
createItem: builder.mutation<ItemResponse, CreateRequest>({
  query: (body) => ({
    url: "/items",
    method: "POST",
    body,
  }),
  transformResponse: (response: ApiResponse<Item>) => response.data,
  invalidatesTags: ["Item"],
}),
```

### Component with Pagination

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
    onChange: (page) => setCurrentPage(page),
  }}
/>;
```

## Quick Fixes

### "Property 'data' does not exist"

- Check if API response uses `data` key (not `items`)
- Verify `transformResponse` is correct
- Check response type definition

### "Pagination is undefined"

- Ensure API returns `pagination` object
- Check service returns pagination metadata
- Verify repository returns count

### "Type error in component"

- Check if using `useAppSelector` and `useAppDispatch`
- Verify types are imported from `@OrianaTypes`
- Check component props are properly typed

## Testing Your Setup

1. **Test Basic Prompt**:

   ```
   @ui/src/Components/UserManagment/UserManagment.tsx
   Explain how pagination works in this component
   ```

2. **Test Code Generation**:

   ```
   @ui/src/store/api/userApi.ts
   Add a new endpoint getUsersByRole that filters users by roleId
   ```

3. **Test Pattern Matching**:
   ```
   @ui/src/pages/Dashboard.tsx
   Add pagination following the same pattern as UserManagment.tsx
   ```

## Performance Tips

- Use `@filename` to reference files (faster context)
- Reference similar implementations for pattern matching
- Break complex tasks into smaller steps
- Review generated code before accepting
- Test incrementally
