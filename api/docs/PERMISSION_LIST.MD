# Permission List

> **Last Updated:** December 2024  
> **Total Permissions:** 23

## Related Documentation

| Document | Description |
|----------|-------------|
| [ROLE_PERMISSION_MATRIX.md](./ROLE_PERMISSION_MATRIX.md) | Role definitions and permission mappings |
| [AUTHORIZATION_IMPLEMENTATION.md](./AUTHORIZATION_IMPLEMENTATION.md) | Technical implementation guide |

## Frontend Constants

All permissions are defined in `ui/src/constants/permissions.ts`:

```typescript
import { PERMISSIONS } from '../constants/permissions';

// Example usage:
const canCreate = usePermission(PERMISSIONS.PO_CREATE);
```

---

## Permission Categories

### Product Management

| Permission Name | Permission Code | Description |
|-----------------|-----------------|-------------|
| Product Management Create | `product_create` | Create products, OEM, Category, Client |
| Product Management Read | `product_read` | Read products, OEM, Category, Client |
| Product Management Update | `product_update` | Update products, OEM, Category, Client |
| Product Management Delete | `product_delete` | Delete products, OEM, Category, Client |

### User Management

| Permission Name | Permission Code | Description |
|-----------------|-----------------|-------------|
| Users Management Create | `users_create` | Create users, roles and permissions |
| Users Management Read | `users_read` | Read users, roles and permissions |
| Users Management Update | `users_update` | Update users, roles and permissions |
| Users Management Delete | `users_delete` | Delete users, roles and permissions |
| Users Management View | `users_view` | View users, roles and permissions |

### PO (Purchase Order) Management

| Permission Name | Permission Code | Description |
|-----------------|-----------------|-------------|
| PO Management Create | `po_create` | Create POs |
| PO Management Read | `po_read` | Read POs |
| PO Management Update | `po_update` | Update POs |
| PO Management Delete | `po_delete` | Delete POs |
| PO Pricing View Own | `po_pricing_view_own` | View pricing of own created POs only |
| PO Pricing View All | `po_pricing_view_all` | View pricing of all POs (Admin only) |

### Dispatch Management

| Permission Name | Permission Code | Description |
|-----------------|-----------------|-------------|
| Dispatch Management Create | `dispatch_create` | Create Dispatches, Delivery and documents |
| Dispatch Management Read | `dispatch_read` | Read Dispatches, Delivery and documents |
| Dispatch Management Update | `dispatch_update` | Update Dispatches, Delivery and documents |
| Dispatch Management Delete | `dispatch_delete` | Delete Dispatches, Delivery and documents |

### Commissioning Management

| Permission Name | Permission Code | Description |
|-----------------|-----------------|-------------|
| Commissioning Management Create | `commissioning_create` | Create Pre-Commissioning, Commissioning, and Warranty |
| Commissioning Management Read | `commissioning_read` | Read Pre-Commissioning, Commissioning, and Warranty |
| Commissioning Management Update | `commissioning_update` | Update Pre-Commissioning, Commissioning, and Warranty |
| Commissioning Management Delete | `commissioning_delete` | Delete Pre-Commissioning, Commissioning, and Warranty |

---

## Adding New Permissions

1. Add to database `permissions` table
2. Add to `ui/src/constants/permissions.ts`
3. Update this document
4. Update `ROLE_PERMISSION_MATRIX.md` with role assignments
5. Use in components with `usePermission` hook or `Can` component
