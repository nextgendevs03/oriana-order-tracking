-- Bulk Insert Permissions
-- This script inserts all permissions from PERMISSION_LIST.MD into the permissions table
-- Run this after ensuring the permissions table exists and has the correct schema

INSERT INTO permissions (
  permission_code,
  permission_name,
  description,
  created_by,
  updated_by,
  is_active,
  created_at,
  updated_at
) VALUES
  -- Product Management Permissions
  ('product_create', 'Product Management Create', 'Permission to create products, OEM, Category, Client', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_read', 'Product Management Read', 'Permission to Read products, OEM, Category, Client', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_update', 'Product Management Update', 'Permission to Update products, OEM, Category, Client', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('product_delete', 'Product Management Delete', 'Permission to Delete products, OEM, Category, Client', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Users Management Permissions
  ('users_create', 'Users management Create', 'Permission to Create users, roles and permissions', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('users_read', 'Users management Read', 'Permission to Read users, roles and permissions', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('users_update', 'Users management Update', 'Permission to Update users, roles and permissions', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('users_delete', 'Users management Delete', 'Permission to Delete users, roles and permissions', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('users_view', 'Users management View', 'Permission to View users, roles and permissions', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- PO Management Permissions
  ('po_create', 'PO management Create', 'Permission to Create POs', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('po_read', 'PO management Read', 'Permission to Read POs', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('po_update', 'PO management Update', 'Permission to Update POs', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('po_delete', 'PO management Delete', 'Permission to Delete POs', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Dispatch Management Permissions
  ('dispatch_create', 'Dispatch management Create', 'Permission to Create Dispatches, Delivery and documents', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dispatch_read', 'Dispatch management Read', 'Permission to Read Dispatches, Delivery and documents', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dispatch_update', 'Dispatch management Update', 'Permission to Update Dispatches, Delivery and documents', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('dispatch_delete', 'Dispatch management Delete', 'Permission to Delete Dispatches, Delivery and documents', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  
  -- Commissioning Management Permissions
  ('commissioning_create', 'Commissioning management Create', 'Permission to Create Pre-Commissioning, Commissioning, and Warranty', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('commissioning_read', 'Commissioning management Read', 'Permission to Read Pre-Commissioning, Commissioning, and Warranty', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('commissioning_update', 'Commissioning management Update', 'Permission to Update Pre-Commissioning, Commissioning, and Warranty', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('commissioning_delete', 'Commissioning management Delete', 'Permission to Delete Pre-Commissioning, Commissioning, and Warranty', 'system', 'system', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (permission_code) DO UPDATE SET
  permission_name = EXCLUDED.permission_name,
  description = EXCLUDED.description,
  updated_by = EXCLUDED.updated_by,
  updated_at = CURRENT_TIMESTAMP;

-- Verify the insert
SELECT 
  permission_id,
  permission_code,
  permission_name,
  description,
  is_active
FROM permissions
ORDER BY permission_id;

