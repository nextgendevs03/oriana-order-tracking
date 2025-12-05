<!-- 4e69e00a-6f4a-42e8-abb9-0f1d6841b81d dac12056-6c92-4fcc-8d84-d22873c2a0f5 -->
# Lambda Creation Automation Plan

## Current vs New Process

**Current (6+ files to touch):**

1. Create schema, controller, service, repository
2. Update `types.ts`
3. Create `container/<name>.container.ts` (boilerplate)
4. Create `handlers/<name>.handler.ts` (boilerplate)
5. Update `esbuild.config.js` entry points
6. Update `generate-manifest.ts` imports
7. Run build

**New (4 files only):**

1. Create schema, controller, service, repository
2. Update `types.ts` with symbols AND bindings config
3. Export controller from `controllers/index.ts`
4. Run build (everything auto-discovered)

---

## Implementation

### 1. Create Service Registry in Shared Layer

Add a new registry system in [`api/layers/shared/nodejs/src/core/`](api/layers/shared/nodejs/src/core/) that allows lambdas to register their DI bindings declaratively.

```typescript
// New file: service-registry.ts
export interface ServiceBinding {
  symbol: symbol;
  implementation: new (...args: any[]) => any;
  scope?: 'singleton' | 'transient';
}

export interface LambdaConfig {
  name: string;
  bindings: ServiceBinding[];
  models?: (sequelize: Sequelize) => void;
}

class LambdaRegistry {
  private configs: Map<string, LambdaConfig> = new Map();
  register(config: LambdaConfig): void { ... }
  getConfig(name: string): LambdaConfig | undefined { ... }
}

export const lambdaRegistry = new LambdaRegistry();
```

### 2. Create Generic Handler Factory

Add to [`api/layers/shared/nodejs/src/core/`](api/layers/shared/nodejs/src/core/):

```typescript
// New file: handler-factory.ts
export function createLambdaHandler(lambdaName: string) {
  // Returns a fully configured Lambda handler that:
  // 1. Creates container from registry bindings
  // 2. Initializes DB connection
  // 3. Routes requests via Router
  // Uses same pattern as current po.handler.ts but generic
}
```

### 3. Create Lambda Entry Point Generator

Modify [`api/esbuild.config.js`](api/esbuild.config.js) to:

- Auto-discover all `*.handler.ts` files OR
- Generate entry points dynamically from a single `src/lambdas.ts` config file

The simplest approach: Create one config file per lambda that developers maintain:

```typescript
// New file: src/lambdas/po.lambda.ts
import { defineLambda } from '@oriana/shared';
import { TYPES } from '../types/types';
import { POController } from '../controllers/POController';
import { POService } from '../services/POService';
import { PORepository } from '../repositories/PORepository';
import { initializeModels } from '../models';

export default defineLambda({
  name: 'po',
  controller: POController,
  bindings: [
    { symbol: TYPES.POService, implementation: POService },
    { symbol: TYPES.PORepository, implementation: PORepository },
  ],
  initModels: initializeModels,
});
```

### 4. Update Esbuild Config for Auto-Discovery

Modify [`api/esbuild.config.js`](api/esbuild.config.js):

```javascript
const glob = require('glob');

// Auto-discover all lambda configs
const lambdaFiles = glob.sync('src/lambdas/*.lambda.ts');
const entryPoints = lambdaFiles.map(f => ({
  in: f,
  out: `handlers/${path.basename(f, '.lambda.ts')}`
}));
```

### 5. Update Manifest Generator for Auto-Discovery

Modify [`api/scripts/generate-manifest.ts`](api/scripts/generate-manifest.ts):

```typescript
// Auto-import all controllers from index
import '../src/controllers';
// OR auto-discover controller files
const controllerFiles = glob.sync('../src/controllers/*Controller.ts');
```

### 6. Create Controllers Index File

Create [`api/src/controllers/index.ts`](api/src/controllers/index.ts):

```typescript
// Export all controllers - add new controllers here
export * from './POController';
// export * from './DispatchController';
```

### 7. Update Documentation

Update [`api/README.md`](api/README.md) with new simplified process.

---

## Files to Create/Modify

| Action | File |

|--------|------|

| CREATE | `api/layers/shared/nodejs/src/core/service-registry.ts` |

| CREATE | `api/layers/shared/nodejs/src/core/handler-factory.ts` |

| MODIFY | `api/layers/shared/nodejs/src/core/index.ts` |

| MODIFY | `api/layers/shared/nodejs/src/index.ts` |

| CREATE | `api/src/lambdas/po.lambda.ts` |

| MODIFY | `api/esbuild.config.js` |

| MODIFY | `api/scripts/generate-manifest.ts` |

| CREATE | `api/src/controllers/index.ts` |

| DELETE | `api/src/container/po.container.ts` |

| DELETE | `api/src/handlers/po.handler.ts` |

| MODIFY | `api/README.md` |

### To-dos

- [ ] Create generic handler factory in shared layer
- [ ] Create container factory for auto-binding DI
- [ ] Create auto-discovery esbuild config
- [ ] Create auto-discovery manifest generator
- [ ] Create Lambda generator CLI script
- [ ] Update docs with new simplified process
- [ ] Create service-registry.ts with LambdaRegistry class in shared layer
- [ ] Create handler-factory.ts with generic createLambdaHandler function
- [ ] Update shared layer index.ts exports
- [ ] Create po.lambda.ts config file to replace container + handler
- [ ] Update esbuild.config.js for auto-discovery of lambda files
- [ ] Update generate-manifest.ts to auto-import controllers
- [ ] Create controllers/index.ts for centralized exports
- [ ] Delete redundant container and handler files
- [ ] Update README with new simplified Lambda creation process