<!-- 9894c926-3c53-4bbd-850d-8b5d8754f303 a19d513e-9b2a-4bbf-b67a-4052dd3031b1 -->
# Clean Path Alias for Shared Layer

## Current State

- Runtime imports use `/opt/nodejs/dist` (Lambda layer mount path)
- tsconfig.json maps `/opt/nodejs/dist` to `./layers/shared/nodejs/src` for development
- Build script uses relative path `../layers/shared/nodejs/src/decorators`

## Changes

### 1. Update tsconfig.json path aliases

In [api/tsconfig.json](api/tsconfig.json), add a cleaner alias alongside the existing one:

```json
"paths": {
  "@oriana/shared": ["./layers/shared/nodejs/src"],
  "@oriana/shared/*": ["./layers/shared/nodejs/src/*"],
  "/opt/nodejs/dist": ["./layers/shared/nodejs/src"],
  "/opt/nodejs/dist/*": ["./layers/shared/nodejs/src/*"]
}
```

### 2. Update esbuild config for runtime resolution

In [api/esbuild.config.js](api/esbuild.config.js), add alias to resolve `@oriana/shared` to `/opt/nodejs/dist` at runtime (since Lambda layer is at that path).

### 3. Update all imports to use new alias

Replace imports in these files:

- `api/src/handlers/po.handler.ts` - change `/opt/nodejs/dist` to `@oriana/shared`
- `api/src/controllers/POController.ts` - change `/opt/nodejs/dist` to `@oriana/shared`
- `api/src/container/po.container.ts` - change `/opt/nodejs/dist` to `@oriana/shared`
- `api/scripts/generate-manifest.ts` - change relative path to `@oriana/shared`

### 4. Update layer tsconfig (optional)

Ensure [api/layers/shared/nodejs/tsconfig.json](api/layers/shared/nodejs/tsconfig.json) builds correctly.

## Result

Before:

```typescript
import { Controller, Get } from '/opt/nodejs/dist';
import { routeRegistry } from '../layers/shared/nodejs/src/decorators';
```

After:

```typescript
import { Controller, Get } from '@oriana/shared';
import { routeRegistry } from '@oriana/shared';
```

### To-dos

- [ ] Add @oriana/shared path alias to api/tsconfig.json
- [ ] Configure esbuild to resolve @oriana/shared to /opt/nodejs/dist at runtime
- [ ] Update all imports to use @oriana/shared instead of /opt/nodejs/dist
- [ ] Verify build and manifest generation work correctly