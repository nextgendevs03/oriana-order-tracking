---
name: Role-Based Permission Implementation
overview: Implement comprehensive role-based permission system with new permissions for pricing visibility, update frontend components (sidebar, PO forms, dispatch forms, commissioning forms) with permission checks, disabled states, and tooltips. Create new documentation for role-permission matrix.
todos:
  - id: create-role-matrix-doc
    content: Create api/docs/ROLE_PERMISSION_MATRIX.md with role definitions and mappings
    status: completed
  - id: update-permission-list
    content: Update api/docs/PERMISSION_LIST.MD with new pricing permissions
    status: completed
  - id: update-permission-constants
    content: Add new pricing permission constants to ui/src/constants/permissions.ts
    status: completed
  - id: update-sidebar
    content: Add permission checks to SidebarMenu.tsx for Admin menu visibility
    status: completed
  - id: update-dashboard
    content: Add permission checks to Dashboard.tsx for Create PO button and pricing columns
    status: completed
  - id: update-create-po
    content: Add permission checks to CreatePO.tsx and POItemsTable.tsx for pricing fields
    status: completed
  - id: update-po-details
    content: Add permission checks to PODetails.tsx for all form buttons with tooltips
    status: completed
  - id: update-form-modals
    content: Add view-only mode to dispatch and commissioning form modals
    status: completed
---

# Role-Based Permission Implementation Plan

## Role-Permission Matrix

| Role | Admin Menu | PO CRUD | PO Pricing | Dispatch/Delivery | Commissioning/Warranty |

|------|------------|---------|------------|-------------------|------------------------|

| **Admin** | Full Access | Full CRUD | View All | Full CRUD | Full CRUD |

| **Sales** | No Access | Full CRUD | View Own Only | View Only | View Only |

| **SupplyChain** | No Access | View Only | No Access | Full CRUD | View Only |

| **Service** | No Access | View Only | No Access | View Only | Full CRUD |

## New Permissions Required

Add to existing permissions:

- `po_pricing_view_own` - View pricing of own POs only
- `po_pricing_view_all` - View pricing of all POs (Admin)

## Files to Create/Modify

### Phase 1: Documentation (New Document)

Create [`api/docs/ROLE_PERMISSION_MATRIX.md`](api/docs/ROLE_PERMISSION_MATRIX.md):

- Define all 4 roles with descriptions
- Role-Permission mapping table
- Permission groupings by module
- SQL seed data for roles and role_permissions
- Usage guidelines

Update [`api/docs/PERMISSION_LIST.MD`](api/docs/PERMISSION_LIST.MD):

- Add new pricing permissions

### Phase 2: Frontend Constants

Update [`ui/src/constants/permissions.ts`](ui/src/constants/permissions.ts):

- Add `PO_PRICING_VIEW_OWN` and `PO_PRICING_VIEW_ALL`

### Phase 3: Sidebar Permission Checks

Update [`ui/src/Components/SidebarMenu.tsx`](ui/src/Components/SidebarMenu.tsx):

- Import permission hooks
- Filter Admin menu items based on `users_read` permission
- Show/hide menu items dynamically

### Phase 4: Dashboard PO List

Update [`ui/src/pages/Dashboard.tsx`](ui/src/pages/Dashboard.tsx):

- Hide "Create PO" button if no `po_create` permission
- Conditionally show pricing columns based on `po_pricing_view_*` permissions

### Phase 5: PO Creation/Edit Forms

Update [`ui/src/pages/CreatePO.tsx`](ui/src/pages/CreatePO.tsx):

- Wrap form submission with `po_create` permission check
- Disable pricing fields if no pricing permission

Update [`ui/src/Components/POManagement/POItemsTable.tsx`](ui/src/Components/POManagement/POItemsTable.tsx):

- Conditionally show/hide or disable pricing columns (pricePerUnit, totalPrice, finalPrice)
- Add tooltip for disabled fields

### Phase 6: PO Details Page

Update [`ui/src/pages/PODetails.tsx`](ui/src/pages/PODetails.tsx):

- Dispatch section: Show Create/Edit/Delete buttons only with `dispatch_create/update/delete`
- Commissioning section: Show buttons only with `commissioning_create/update/delete`
- Disable buttons with tooltips for view-only access
- Hide pricing in PO Items table based on permissions

### Phase 7: Form Modals

Update Dispatch modals:

- [`ui/src/Components/POManagement/DispatchFormModal.tsx`](ui/src/Components/POManagement/DispatchFormModal.tsx)
- [`ui/src/Components/POManagement/DispatchDocumentFormModal.tsx`](ui/src/Components/POManagement/DispatchDocumentFormModal.tsx)
- [`ui/src/Components/POManagement/DeliveryConfirmationFormModal.tsx`](ui/src/Components/POManagement/DeliveryConfirmationFormModal.tsx)

Update Commissioning modals:

- [`ui/src/Components/POManagement/PreCommissioningFormModal.tsx`](ui/src/Components/POManagement/PreCommissioningFormModal.tsx)
- [`ui/src/Components/POManagement/CommissioningFormModal.tsx`](ui/src/Components/POManagement/CommissioningFormModal.tsx)
- [`ui/src/Components/POManagement/WarrantyCertificateFormModal.tsx`](ui/src/Components/POManagement/WarrantyCertificateFormModal.tsx)

### Phase 8: Backend Changes (if needed)

Update [`api/src/services/POService.ts`](api/src/services/POService.ts):

- Filter PO pricing visibility based on user permissions and ownership
- Add `createdBy` check for `po_pricing_view_own` permission

## Implementation Approach

1. Fields without permission: Show as disabled with Tooltip
2. Buttons without permission: Hide or show disabled with Tooltip
3. Menu items without permission: Hide completely
4. Pricing fields: Show "---" or hide column entirely

## Tooltip Messages

- "You don't have permission to create POs"
- "You don't have permission to edit this field"
- "Contact administrator for access"