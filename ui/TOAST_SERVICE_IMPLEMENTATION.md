# Global Toast Service Implementation Plan

## Problem Statement

Currently, when a toast/notification is shown and the user is immediately redirected to a new page, the toast disappears because it's tied to the component lifecycle. This creates a poor user experience where important feedback messages are lost during navigation.

## Solution Overview

Create a global toast service that:

- Persists toasts across page navigations
- Works independently of React component lifecycle
- Provides a centralized API for showing toasts
- Supports different toast types (success, error, warning, info)
- Auto-dismisses toasts after a configurable duration
- Maintains toast queue for multiple simultaneous toasts

## Architecture

### Components

1. **Toast Service** (`src/services/toastService.ts`)
   - Core service managing toast state
   - Methods: `showSuccess()`, `showError()`, `showWarning()`, `showInfo()`
   - Toast queue management
   - Auto-dismiss logic

2. **Toast Store** (Redux slice or Context)
   - Global state for active toasts
   - Actions: `addToast`, `removeToast`, `clearAllToasts`
   - Selector: `selectActiveToasts`

3. **Toast Provider Component** (`src/Components/ToastProvider/ToastProvider.tsx`)
   - Renders toasts at app root level
   - Listens to toast store changes
   - Handles toast rendering and animations
   - Positioned outside router to persist across navigation

4. **Toast Hook** (`src/hooks/useToast.ts`)
   - React hook for easy toast usage
   - Wraps toast service methods
   - Provides type-safe API

5. **Toast Container** (`src/Components/ToastProvider/ToastContainer.tsx`)
   - Visual container for toasts
   - Handles positioning (top-right, top-left, etc.)
   - Manages toast stacking and animations

## Implementation Steps

### Step 1: Create Toast Types and Interfaces

**File**: `src/types/toast.ts`

```typescript
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number; // milliseconds, 0 = don't auto-dismiss
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
}

export interface ToastState {
  toasts: Toast[];
}
```

### Step 2: Create Toast Redux Slice

**File**: `src/store/toastSlice.ts`

- Use `createSlice` from Redux Toolkit (consistent with existing slices)
- Actions:
  - `addToast`: Add a new toast to the queue
  - `removeToast`: Remove a toast by ID
  - `clearAllToasts`: Clear all active toasts
- Reducer handles toast state management
- Export actions and reducer
- **Note**: Toast slice should NOT be persisted (add to blacklist in persistConfig)

### Step 3: Create Toast Service

**File**: `src/services/toastService.ts`

- Core service class with static methods
- Generates unique IDs for toasts
- Handles auto-dismiss timers
- Integrates with Redux store to dispatch actions
- Provides convenience methods:
  - `showSuccess(message, options?)`
  - `showError(message, options?)`
  - `showWarning(message, options?)`
  - `showInfo(message, options?)`

### Step 4: Create Toast Provider Component

**File**: `src/Components/ToastProvider/ToastProvider.tsx`

- Wraps the entire app (placed in App.tsx)
- Renders outside React Router to persist across navigation
- Subscribes to toast store
- Renders ToastContainer with active toasts
- Handles toast animations (enter/exit)

### Step 5: Create Toast Container Component

**File**: `src/Components/ToastProvider/ToastContainer.tsx`

- Renders individual toast items
- Handles positioning (top-right by default)
- Manages toast stacking
- Implements animations using Ant Design's notification or custom CSS
- Handles click-to-dismiss

### Step 6: Create useToast Hook

**File**: `src/hooks/useToast.ts`

- React hook wrapping toast service
- Returns methods: `success`, `error`, `warning`, `info`
- Can be used in any component

### Step 7: Integrate with App

**File**: `src/index.tsx`

- Add ToastProvider inside Redux Provider but outside PersistGate
- Structure: `Provider` > `PersistGate` > `ConfigProvider` > `ToastProvider` > `App`
- This ensures toasts persist across navigation but don't persist to storage

**File**: `src/store/index.ts`

- Add `toastReducer` to `rootReducer`
- Add `'toast'` to `persistConfig.blacklist` (toasts are temporary, shouldn't persist)

### Step 8: Update Existing Code

**Priority 1: Critical Error Handling**

- `src/store/api/baseApi.ts`: Replace `message.error()` in token expiry handler
- All API error handlers in RTK Query mutations

**Priority 2: Success Messages**

- Replace `message.success()` in mutation success handlers
- Update components using `useCreateUserMutation`, `useUpdateUserMutation`, etc.

**Priority 3: General Usage**

- Replace all remaining `message.*` calls throughout the app
- Remove `import { message } from 'antd'` from files

## Technical Details

### Toast Lifecycle

1. **Creation**: Toast is created via service method
2. **Storage**: Added to Redux store
3. **Rendering**: ToastProvider renders it in ToastContainer
4. **Display**: Toast appears with animation
5. **Auto-dismiss**: Timer starts (if duration > 0)
6. **Removal**: Toast removed from store after duration or manual dismiss
7. **Cleanup**: Animation completes, component unmounts

### Code Structure Examples

#### Example: toastSlice.ts Structure

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Toast, ToastState } from "../types/toast";

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    addToast: (state, action: PayloadAction<Toast>) => {
      state.toasts.push(action.payload);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;
```

#### Example: toastService.ts Structure

```typescript
import { store } from "../store";
import { addToast, removeToast } from "../store/toastSlice";
import { Toast, ToastType } from "../types/toast";

class ToastService {
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private show(
    type: ToastType,
    message: string,
    options?: Partial<Toast>
  ): string {
    const id = this.generateId();
    const toast: Toast = {
      id,
      type,
      message,
      description: options?.description,
      duration: options?.duration ?? this.getDefaultDuration(type),
      action: options?.action,
      createdAt: Date.now(),
    };

    store.dispatch(addToast(toast));

    // Auto-dismiss if duration > 0
    if (toast.duration && toast.duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, toast.duration);
    }

    return id;
  }

  private getDefaultDuration(type: ToastType): number {
    switch (type) {
      case "success":
      case "info":
        return 3000; // 3 seconds
      case "error":
      case "warning":
        return 5000; // 5 seconds
      default:
        return 3000;
    }
  }

  showSuccess(message: string, options?: Partial<Toast>): string {
    return this.show("success", message, options);
  }

  showError(message: string, options?: Partial<Toast>): string {
    return this.show("error", message, options);
  }

  showWarning(message: string, options?: Partial<Toast>): string {
    return this.show("warning", message, options);
  }

  showInfo(message: string, options?: Partial<Toast>): string {
    return this.show("info", message, options);
  }

  dismiss(id: string): void {
    store.dispatch(removeToast(id));
  }
}

export const toastService = new ToastService();
```

#### Example: ToastProvider.tsx Structure

```typescript
import React from 'react';
import { useAppSelector } from '../store/hooks';
import { selectActiveToasts } from '../store/toastSlice';
import ToastContainer from './ToastContainer';

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toasts = useAppSelector(selectActiveToasts);

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} />
    </>
  );
};

export default ToastProvider;
```

#### Example: index.tsx Integration

```typescript
// Current structure
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <ConfigProvider theme={antTheme}>
      <App />
    </ConfigProvider>
  </PersistGate>
</Provider>

// Updated structure (ToastProvider outside Router but inside Redux)
<Provider store={store}>
  <PersistGate loading={null} persistor={persistor}>
    <ConfigProvider theme={antTheme}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ConfigProvider>
  </PersistGate>
</Provider>
```

### Toast Positioning

- Default: Top-right corner
- Configurable: Top-left, bottom-right, bottom-left
- Stacking: New toasts appear above existing ones
- Max visible: Configurable limit (e.g., 5 toasts)

### Auto-dismiss Behavior

- Default duration: 3 seconds for success/info, 5 seconds for error/warning
- Configurable per toast
- Duration = 0 means toast won't auto-dismiss
- User can manually dismiss by clicking close button

### Persistence Strategy

- ToastProvider placed outside React Router
- Redux store persists across navigation
- Toasts remain in store until dismissed or expired
- No dependency on component mount/unmount

## Usage Examples

### Basic Usage in Components

```typescript
import { useToast } from "../hooks/useToast";
import { useNavigate } from "react-router-dom";

function MyComponent() {
  const toast = useToast();
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success("Data saved successfully");
      navigate("/dashboard");
      // Toast will persist even after navigation
    } catch (error) {
      toast.error("Failed to save data");
    }
  };
}
```

### Usage in RTK Query Mutations

```typescript
// Before (in component)
const [createUser] = useCreateUserMutation();

const handleSubmit = async () => {
  try {
    await createUser(data).unwrap();
    message.success("User created successfully"); // ❌ Old way
    navigate("/user-management");
  } catch (error) {
    message.error("Failed to create user"); // ❌ Old way
  }
};

// After (with toast service)
import { useToast } from "../hooks/useToast";

const toast = useToast();
const [createUser] = useCreateUserMutation();

const handleSubmit = async () => {
  try {
    await createUser(data).unwrap();
    toast.success("User created successfully"); // ✅ New way
    navigate("/user-management");
    // Toast persists across navigation!
  } catch (error) {
    toast.error("Failed to create user"); // ✅ New way
  }
};
```

### Service Usage (Outside Components)

```typescript
// In baseApi.ts or other service files
import { toastService } from "../services/toastService";

// In API error handler
toastService.showError("Session expired. Please login again.");
setTimeout(() => {
  window.location.href = "/";
}, 1500);
// Toast will persist even after redirect
```

### Advanced Usage

```typescript
toast.success("Operation completed", {
  description: "Your changes have been saved",
  duration: 5000,
  action: {
    label: "Undo",
    onClick: () => handleUndo(),
  },
});

// Long duration toast (won't auto-dismiss)
toast.info("Processing...", {
  duration: 0, // Don't auto-dismiss
  description: "This may take a few minutes",
});
```

### Real-World Example: UserManagement Component

```typescript
// Before
import { message } from "antd";

const handleStatusToggle = async (userId: string, isActive: boolean) => {
  try {
    await updateUser({ id: userId, data: { isActive } }).unwrap();
    message.success(`User ${isActive ? "activated" : "deactivated"}`);
    refetch();
  } catch (error) {
    message.error("Failed to update user status");
  }
};

// After
import { useToast } from "../../../hooks/useToast";

const toast = useToast();

const handleStatusToggle = async (userId: string, isActive: boolean) => {
  try {
    await updateUser({ id: userId, data: { isActive } }).unwrap();
    toast.success(`User ${isActive ? "activated" : "deactivated"}`);
    refetch();
    // If navigation happens, toast persists!
  } catch (error) {
    toast.error("Failed to update user status");
  }
};
```

## File Structure

```
ui/src/
├── services/
│   └── toastService.ts          # Core toast service
├── store/
│   └── toastSlice.ts            # Redux slice for toast state
├── hooks/
│   └── useToast.ts              # React hook for toast
├── Components/
│   └── ToastProvider/
│       ├── ToastProvider.tsx    # Main provider component
│       ├── ToastContainer.tsx    # Toast rendering container
│       └── ToastItem.tsx        # Individual toast component
└── types/
    └── toast.ts                 # TypeScript types
```

## Integration Points

### Current Setup

- **Redux Store**: `ui/src/store/index.ts`
- **App Entry**: `ui/src/index.tsx` (Redux Provider already configured)
- **App Component**: `ui/src/App.tsx` (React Router)
- **Base API**: `ui/src/store/api/baseApi.ts` (currently uses `message` from antd)

### Integration Locations

1. **index.tsx**: Add ToastProvider inside Redux Provider, outside PersistGate
2. **store/index.ts**: Add toastReducer to rootReducer
3. **store/index.ts**: Add 'toast' to persistConfig blacklist (toasts shouldn't persist)
4. **baseApi.ts**: Replace `message.error()` with toast service
5. **All mutation hooks**: Update success/error handlers to use toast service

## Migration Strategy

### Phase 1: Implementation (Day 1)

1. Create all toast-related files:
   - `src/types/toast.ts`
   - `src/store/toastSlice.ts`
   - `src/services/toastService.ts`
   - `src/hooks/useToast.ts`
   - `src/Components/ToastProvider/ToastProvider.tsx`
   - `src/Components/ToastProvider/ToastContainer.tsx`
   - `src/Components/ToastProvider/ToastItem.tsx`
2. Update `src/store/index.ts`:
   - Add `toastReducer` to `rootReducer`
   - Add `'toast'` to `persistConfig.blacklist`
3. Update `src/index.tsx`:
   - Add `<ToastProvider />` inside Provider, outside PersistGate
4. Test basic functionality:
   - Show toast from a component
   - Navigate to another page
   - Verify toast persists

### Phase 2: Critical Integration (Day 1-2)

1. Update `src/store/api/baseApi.ts`:
   - Replace `message.error()` with `toastService.showError()`
   - Test token expiry scenario
2. Update mutation hooks in API files:
   - `userApi.ts`, `poApi.ts`, `roleApi.ts`, etc.
   - Replace success/error message calls
3. Test critical flows:
   - Login/logout
   - API errors
   - Form submissions

### Phase 3: Gradual Migration (Day 2-3)

1. Replace `message.success()` in all mutation success handlers
2. Update components one by one:
   - UserManagement components
   - Dashboard
   - CreatePO
   - Product Management components
3. Keep Ant Design message as fallback during transition
4. Test each component after migration

### Phase 4: Complete Migration (Day 3-4)

1. Search for all `message.` usages: `grep -r "message\." src/`
2. Replace remaining instances
3. Remove all `import { message } from 'antd'` imports
4. Final testing:
   - Test all user flows
   - Verify toast persistence across navigation
   - Test error scenarios
   - Test success scenarios
5. Cleanup and documentation

## Benefits

1. **Persistence**: Toasts survive page navigation
2. **Centralized**: Single source of truth for notifications
3. **Consistent**: Uniform toast appearance and behavior
4. **Flexible**: Easy to customize and extend
5. **Type-safe**: Full TypeScript support
6. **Testable**: Service can be easily unit tested

## Configuration Options

- Default duration per toast type
- Maximum number of visible toasts
- Toast position (top-right, top-left, etc.)
- Animation duration
- Stacking behavior
- Click-to-dismiss behavior

## Testing Considerations

- Unit tests for toast service
- Integration tests for ToastProvider
- E2E tests for toast persistence across navigation
- Test toast queue management
- Test auto-dismiss functionality

## Troubleshooting

### Common Issues

**Issue**: Toasts disappear on navigation

- **Solution**: Ensure ToastProvider is placed outside React Router in the component tree
- **Check**: Verify ToastProvider wraps the entire App component, not individual routes

**Issue**: Toasts persist after page refresh

- **Solution**: Ensure 'toast' is in persistConfig.blacklist in store/index.ts
- **Check**: Toasts should not be persisted to localStorage

**Issue**: Multiple toasts stacking incorrectly

- **Solution**: Check ToastContainer CSS for proper positioning and z-index
- **Check**: Ensure max visible toasts limit is configured

**Issue**: Auto-dismiss not working

- **Solution**: Verify duration is > 0 and setTimeout is properly configured
- **Check**: Check browser console for errors in toast service

**Issue**: TypeScript errors with toast types

- **Solution**: Ensure all toast-related types are properly exported
- **Check**: Verify imports in components using toast service

### Performance Considerations

- Limit maximum visible toasts (recommended: 5-7)
- Clean up dismissed toasts from Redux store
- Use CSS animations instead of JavaScript for better performance
- Debounce rapid toast calls if needed

### Browser Compatibility

- Test in Chrome, Firefox, Safari, Edge
- Verify CSS animations work in all browsers
- Test on mobile devices (iOS Safari, Chrome Mobile)
- Ensure z-index doesn't conflict with modals/dropdowns

## Future Enhancements

- Toast grouping (multiple errors in one toast)
- Toast history (view past toasts)
- Custom toast templates
- Sound notifications
- Toast priorities
- Toast categories/filtering
- Toast analytics (track which toasts are shown most)
- Toast themes (dark mode support)

## Implementation Checklist

### Setup Phase

- [ ] Create `src/types/toast.ts` with TypeScript interfaces
- [ ] Create `src/store/toastSlice.ts` with Redux slice
- [ ] Update `src/store/index.ts` to include toast reducer
- [ ] Create `src/services/toastService.ts` with core service
- [ ] Create `src/hooks/useToast.ts` React hook
- [ ] Create `src/Components/ToastProvider/ToastProvider.tsx`
- [ ] Create `src/Components/ToastProvider/ToastContainer.tsx`
- [ ] Create `src/Components/ToastProvider/ToastItem.tsx`
- [ ] Update `src/index.tsx` to include ToastProvider
- [ ] Test basic toast functionality

### Integration Phase

- [ ] Update `src/store/api/baseApi.ts` error handler
- [ ] Update all API mutation hooks (userApi, poApi, roleApi, etc.)
- [ ] Update UserManagement components
- [ ] Update Dashboard component
- [ ] Update CreatePO component
- [ ] Update Product Management components
- [ ] Update all other components using `message.*`

### Testing Phase

- [ ] Test toast persistence across navigation
- [ ] Test toast auto-dismiss functionality
- [ ] Test manual dismiss functionality
- [ ] Test multiple toasts stacking
- [ ] Test error scenarios
- [ ] Test success scenarios
- [ ] Test in different browsers
- [ ] Test on mobile devices

### Cleanup Phase

- [ ] Remove all `message` imports from antd
- [ ] Remove unused message-related code
- [ ] Update documentation
- [ ] Code review
- [ ] Final testing
