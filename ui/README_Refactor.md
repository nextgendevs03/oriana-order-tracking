# Refactoring Plan - OSG Order Tracking System

## Overview

This document outlines the refactoring plan to optimize and improve the maintainability of the codebase. The focus is on extracting common utility functions and constants to reduce code duplication.

---

## 📋 Code Analysis Findings

### Files Analyzed
- `pages/Dashboard.tsx`
- `pages/PODetails.tsx`
- `pages/CreatePO.tsx`
- `pages/Settings.tsx`
- `Components/DispatchModal.tsx`

---

## 🔍 Issues Identified

### 1. **Duplicate `formatLabel` Function**

**Found in:** `Dashboard.tsx`, `PODetails.tsx`, `DispatchModal.tsx`

```typescript
// Same function repeated 3 times
const formatLabel = (value: string) => {
  if (!value) return "";
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
```

**Impact:** Code duplication, harder to maintain if logic changes.

---

### 2. **Duplicate Status Color Functions**

**Found in:** `Dashboard.tsx`, `PODetails.tsx`

```typescript
// getPaymentStatusColor - duplicated in 2 files
const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "advanced":
    case "received": return "green";
    case "pending": return "orange";
    // ... more cases
  }
};

// getPoStatusColor - duplicated in 2 files  
const getPoStatusColor = (status: string) => { ... };
```

**Impact:** If status colors change, must update multiple files.

---

### 3. **Duplicate Form Validation Rules**

**Found in:** `CreatePO.tsx`, `DispatchModal.tsx`

```typescript
// Same validation rules in multiple components
const textFieldRules = [
  { required: true, message: "This field is required" },
  { min: 3, message: "Minimum 3 characters required" },
];
const dateFieldRules = [{ required: true, message: "Please select a date" }];
```

**Impact:** Inconsistent validation messages across forms.

---

### 4. **Duplicate Currency Formatting**

**Found in:** `Dashboard.tsx`, `PODetails.tsx`

```typescript
// Same pattern repeated multiple times
render: (value) => `₹${value?.toLocaleString() || 0}`
```

**Impact:** Inconsistent formatting if currency symbol changes.

---

### 5. **Duplicate Date Formatting**

**Found in:** `CreatePO.tsx`, `DispatchModal.tsx`

```typescript
// Different implementations
dayjs(date).format("YYYY-MM-DD")
```

**Impact:** Inconsistent date formats across the app.

---

### 6. **Duplicate ID Generation Logic**

**Found in:** `CreatePO.tsx`, `DispatchModal.tsx`

```typescript
// CreatePO.tsx
const poId = `PO-${Date.now().toString().slice(-6)}`;

// DispatchModal.tsx
id: `DISPATCH-${(timestamp + index).toString().slice(-8)}`
```

**Impact:** Inconsistent ID formats, potential collisions.

---

### 7. **Hardcoded Dropdown Options**

**Found in:** `CreatePO.tsx`

All dropdown options (PO Status, Payment Status, Category, etc.) are hardcoded inside the component.

**Impact:** Options cannot be reused, hard to maintain.

---

## ✅ Refactoring Plan

### New Folder Structure

```
ui/src/
├── utils/
│   ├── index.ts              # Barrel export
│   ├── formatters.ts         # String, currency, date formatters
│   ├── statusColors.ts       # Status to color mappings
│   ├── validators.ts         # Form validation rules
│   ├── generators.ts         # ID generation utilities
│   └── constants.ts          # Dropdown options & constants
```

---

## 📁 Utils Implementation Plan

### 1. `formatters.ts`

| Function | Description | Used In |
|----------|-------------|---------|
| `formatLabel()` | Convert snake_case to Title Case | Dashboard, PODetails, DispatchModal |
| `formatCurrency()` | Format number to ₹ currency | Dashboard, PODetails |
| `formatDate()` | Format dayjs to YYYY-MM-DD | CreatePO, DispatchModal |

---

### 2. `statusColors.ts`

| Function | Description | Used In |
|----------|-------------|---------|
| `getPaymentStatusColor()` | Payment status → tag color | Dashboard, PODetails |
| `getPoStatusColor()` | PO status → tag color | Dashboard, PODetails |

---

### 3. `validators.ts`

| Constant | Description | Used In |
|----------|-------------|---------|
| `textFieldRules` | Required + min 3 chars | CreatePO, DispatchModal |
| `numberFieldRules` | Required number | CreatePO |
| `selectFieldRules` | Required select | CreatePO |
| `dateFieldRules` | Required date | CreatePO, DispatchModal |

---

### 4. `generators.ts`

| Function | Description | Used In |
|----------|-------------|---------|
| `generatePOId()` | Generate unique PO-XXXXXX ID | CreatePO |
| `generateDispatchId()` | Generate unique DISPATCH-XXXXXXXX ID | DispatchModal |

---

### 5. `constants.ts`

| Constant | Description | Used In |
|----------|-------------|---------|
| `PO_STATUS_OPTIONS` | PO status dropdown options | CreatePO |
| `PAYMENT_STATUS_OPTIONS` | Payment status options | CreatePO |
| `DISPATCH_OPTIONS` | Dispatch type options | CreatePO |
| `OSC_SUPPORT_OPTIONS` | OSC support options | CreatePO |
| `CATEGORY_OPTIONS` | Item category options | CreatePO |
| `OEM_NAME_OPTIONS` | OEM name options | CreatePO |
| `PRODUCT_OPTIONS` | Product options | CreatePO |
| `WARRANTY_OPTIONS` | Warranty period options | CreatePO |

---

## 🚀 Benefits After Refactoring

| Benefit | Description |
|---------|-------------|
| **DRY Principle** | No repeated code - single source of truth |
| **Maintainability** | Change once, applies everywhere |
| **Consistency** | Same formatting/validation across app |
| **Testability** | Utils can be unit tested independently |
| **Readability** | Cleaner components, focused on UI logic |
| **Performance** | Smaller bundle with shared imports |

---

## 📊 Estimated Impact

| Metric | Before | After |
|--------|--------|-------|
| `formatLabel` definitions | 3 | 1 |
| Status color functions | 4 | 2 |
| Validation rule definitions | 8 | 4 |
| Lines of duplicate code | ~120 | 0 |

---

## 🔄 Migration Steps

1. ✅ Create `utils/` folder structure
2. ✅ Implement utility functions
3. ✅ Update `DispatchModal.tsx` to use utils
4. ✅ Update `Dashboard.tsx` to use utils
5. ✅ Update `PODetails.tsx` to use utils
6. ✅ Update `CreatePO.tsx` to use utils
7. ✅ Test all affected components
8. ✅ Remove duplicate code from components

---

## 📝 Notes

- Components folder is excluded from this refactoring (except DispatchModal.tsx)
- Focus on pages folder files and DispatchModal.tsx only
- No breaking changes to existing functionality

