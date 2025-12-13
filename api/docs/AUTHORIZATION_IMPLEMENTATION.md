# Authorization Implementation Guide

## Role-Based Access Control (RBAC) with Permission-Based UI

> **For:** Junior Developers  
> **Last Updated:** December 2024  
> **Status:** Implementation Guide  
> **Prerequisites:** [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) (JWT Authentication)

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Authorization Concepts & Theory](#2-authorization-concepts--theory)
3. [Database Model](#3-database-model)
4. [Architecture Overview](#4-architecture-overview)
5. [Backend Implementation](#5-backend-implementation)
6. [Frontend Implementation](#6-frontend-implementation)
7. [Usage Examples](#7-usage-examples)
8. [Best Practices](#8-best-practices)
9. [Troubleshooting](#9-troubleshooting)
10. [Checklist](#10-checklist)

---

## 1. Introduction

### 1.1 What We're Building

We are implementing a **permission-based UI authorization system** that:

- Fetches all permissions for the logged-in user's roles
- Stores permissions in Redux for quick access
- Shows/hides UI components based on user permissions
- Provides both a wrapper component and hook for flexibility

### 1.2 Authentication vs Authorization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 AUTHENTICATION vs AUTHORIZATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   AUTHENTICATION (Already Implemented)                                       │
│   ════════════════════════════════════                                       │
│   "WHO are you?"                                                             │
│                                                                              │
│   • Verifies user identity (username/password)                               │
│   • Issues JWT tokens                                                        │
│   • Protects endpoints with @Authenticated decorator                         │
│   • Result: User is logged in or not                                         │
│                                                                              │
│   ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│   AUTHORIZATION (This Document)                                              │
│   ═════════════════════════════                                              │
│   "WHAT are you allowed to do?"                                              │
│                                                                              │
│   • Checks user's roles and permissions                                      │
│   • Shows/hides UI components                                                │
│   • Controls access to features                                              │
│   • Result: User can or cannot perform action                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.3 Our Approach

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AUTHORIZATION FLOW                                    │
│                                                                              │
│   1. User logs in successfully                                               │
│          │                                                                   │
│          ▼                                                                   │
│   2. Frontend calls GET /api/auth/permissions                                │
│          │                                                                   │
│          ▼                                                                   │
│   3. Backend fetches all permissions for user's roles                        │
│          │                                                                   │
│          ▼                                                                   │
│   4. Permissions stored in Redux as JSON array                               │
│          │                                                                   │
│          ▼                                                                   │
│   5. UI components use hook/wrapper to check permissions                     │
│          │                                                                   │
│          ▼                                                                   │
│   6. Components show/hide based on permission check                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Authorization Concepts & Theory

### 2.1 RBAC (Role-Based Access Control)

RBAC is a security model where permissions are assigned to roles, and roles are assigned to users.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              RBAC MODEL                                      │
│                                                                              │
│   ┌──────────┐         ┌──────────┐         ┌──────────────┐                │
│   │   USER   │────────▶│   ROLE   │────────▶│  PERMISSION  │                │
│   └──────────┘   has   └──────────┘   has   └──────────────┘                │
│                                                                              │
│   Examples:                                                                  │
│   ─────────                                                                  │
│                                                                              │
│   User: John                                                                 │
│     └── Role: Admin                                                          │
│           ├── Permission: user:create                                        │
│           ├── Permission: user:delete                                        │
│           ├── Permission: po:view                                            │
│           └── Permission: po:create                                          │
│                                                                              │
│   User: Jane                                                                 │
│     └── Role: Viewer                                                         │
│           ├── Permission: po:view                                            │
│           └── Permission: user:view                                          │
│                                                                              │
│   User: Mike                                                                 │
│     ├── Role: Sales                                                          │
│     │     ├── Permission: po:create                                          │
│     │     └── Permission: po:view                                            │
│     └── Role: Support                                                        │
│           └── Permission: ticket:manage                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key Benefits of RBAC:**
- **Simplified management**: Assign roles to users, not individual permissions
- **Consistency**: All users with same role have same permissions
- **Scalability**: Easy to add new users or modify role permissions
- **Audit trail**: Clear visibility of who can do what

### 2.2 Permission Naming Convention

We use the **Resource:Action** format for clear, consistent permission names:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERMISSION NAMING FORMAT                                │
│                                                                              │
│   Format:  resource:action                                                   │
│                                                                              │
│   ┌────────────┬─────────────────────────────────────────────────────────┐  │
│   │  Resource  │  The entity or feature being accessed                   │  │
│   ├────────────┼─────────────────────────────────────────────────────────┤  │
│   │  Action    │  The operation being performed                          │  │
│   └────────────┴─────────────────────────────────────────────────────────┘  │
│                                                                              │
│   Common Actions:                                                            │
│   ───────────────                                                            │
│   • view    - Read/list resources                                            │
│   • create  - Create new resources                                           │
│   • update  - Modify existing resources                                      │
│   • delete  - Remove resources                                               │
│   • manage  - Full control (often used for admin)                            │
│   • export  - Download/export data                                           │
│   • approve - Approve workflow items                                         │
│                                                                              │
│   Examples:                                                                  │
│   ─────────                                                                  │
│   • user:view       - Can view user list and details                         │
│   • user:create     - Can create new users                                   │
│   • po:create       - Can create purchase orders                             │
│   • po:approve      - Can approve purchase orders                            │
│   • role:manage     - Full control over roles                                │
│   • dashboard:view  - Can access dashboard                                   │
│   • report:export   - Can export reports                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3 Your Database Model

Based on your Prisma schema, you have a flexible permission model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         YOUR DATABASE MODEL                                  │
│                                                                              │
│   ┌──────────┐      ┌──────────────┐      ┌────────────────────────┐        │
│   │   User   │──────│   UserRole   │──────│  UserRolePermission    │        │
│   │          │ 1  n │              │ 1  n │                        │        │
│   │ userId   │      │ userRoleId   │      │ userRolePermissionId   │        │
│   │ username │      │ userId       │      │ userRoleId             │        │
│   │ email    │      │ roleId       │      │ permissionId           │        │
│   └──────────┘      │ isActive     │      │ isActive               │        │
│                     └──────┬───────┘      └───────────┬────────────┘        │
│                            │                          │                      │
│                            │ n                        │ n                    │
│                            │                          │                      │
│                     ┌──────▼───────┐      ┌───────────▼────────────┐        │
│                     │    Role      │      │     Permission         │        │
│                     │              │      │                        │        │
│                     │ roleId       │      │ permissionId           │        │
│                     │ roleName     │      │ permissionName         │        │
│                     │ description  │      │ description            │        │
│                     │ isActive     │      │ isActive               │        │
│                     └──────────────┘      └────────────────────────┘        │
│                                                                              │
│   This model allows:                                                         │
│   • A user to have multiple roles                                            │
│   • Each user-role assignment can have specific permissions                  │
│   • Fine-grained control per user-role combination                           │
│   • Soft delete with isActive flags                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4 Permission Resolution

When a user logs in, we need to collect ALL their permissions:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      PERMISSION RESOLUTION                                   │
│                                                                              │
│   User: John (userId: "abc-123")                                             │
│                                                                              │
│   Step 1: Find all active UserRole entries for this user                     │
│   ─────────────────────────────────────────────────────────────────────────  │
│   SELECT * FROM user_role_mappings                                           │
│   WHERE user_id = 'abc-123' AND is_active = true                             │
│                                                                              │
│   Result:                                                                    │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ userRoleId: "ur-1"  │  userId: "abc-123"  │  roleId: "role-admin" │    │
│   │ userRoleId: "ur-2"  │  userId: "abc-123"  │  roleId: "role-sales" │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│   Step 2: Find all permissions for each UserRole                             │
│   ─────────────────────────────────────────────────────────────────────────  │
│   SELECT p.permission_name FROM user_role_permission_mappings urp            │
│   JOIN permissions p ON urp.permission_id = p.permission_id                  │
│   WHERE urp.user_role_id IN ('ur-1', 'ur-2')                                 │
│   AND urp.is_active = true AND p.is_active = true                            │
│                                                                              │
│   Result:                                                                    │
│   ┌────────────────────────────────────────────────────────────────────┐    │
│   │ "user:create", "user:view", "user:delete",                         │    │
│   │ "po:create", "po:view", "po:approve"                               │    │
│   └────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│   Step 3: Deduplicate (if same permission from multiple roles)               │
│   ─────────────────────────────────────────────────────────────────────────  │
│   Final permissions array (stored in Redux):                                 │
│   ["user:create", "user:view", "user:delete",                                │
│    "po:create", "po:view", "po:approve"]                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Database Model

### 3.1 Current Schema (Already Exists)

Your Prisma schema already has the required models:

```prisma
// User model
model User {
  userId    String     @id @default(uuid())
  username  String     @unique
  email     String     @unique
  password  String
  isActive  Boolean    @default(true)
  userRoles UserRole[] // A user can have multiple roles
  // ... other fields
}

// Role model
model Role {
  roleId      String     @id @default(uuid())
  roleName    String
  description String
  isActive    Boolean    @default(true)
  userRoles   UserRole[]
  // ... other fields
}

// User-Role mapping (junction table)
model UserRole {
  userRoleId          String               @id @default(uuid())
  userId              String
  roleId              String
  user                User                 @relation(...)
  role                Role                 @relation(...)
  isActive            Boolean              @default(true)
  userRolePermissions UserRolePermission[] // Permissions for this assignment
  // ... other fields
}

// User-Role-Permission mapping
model UserRolePermission {
  userRolePermissionId String     @id @default(uuid())
  userRoleId           String
  permissionId         String
  userRole             UserRole   @relation(...)
  permission           Permission @relation(...)
  isActive             Boolean    @default(true)
  // ... other fields
}

// Permission model
model Permission {
  permissionId        String               @id @default(uuid())
  permissionName      String               // e.g., "user:create"
  description         String
  isActive            Boolean              @default(true)
  userRolePermissions UserRolePermission[]
  // ... other fields
}
```

### 3.2 Example Data

Here's example data to understand the relationships:

```sql
-- Permissions table
INSERT INTO permissions (permission_id, permission_name, description) VALUES
('perm-1', 'user:view', 'View users list and details'),
('perm-2', 'user:create', 'Create new users'),
('perm-3', 'user:update', 'Update user details'),
('perm-4', 'user:delete', 'Delete users'),
('perm-5', 'po:view', 'View purchase orders'),
('perm-6', 'po:create', 'Create purchase orders'),
('perm-7', 'po:approve', 'Approve purchase orders'),
('perm-8', 'dashboard:view', 'Access dashboard'),
('perm-9', 'role:manage', 'Manage roles and permissions');

-- Roles table
INSERT INTO roles (role_id, role_name, description) VALUES
('role-1', 'Admin', 'Full system access'),
('role-2', 'Sales', 'Sales team member'),
('role-3', 'Viewer', 'Read-only access');

-- Users table
INSERT INTO users (user_id, username, email) VALUES
('user-1', 'admin', 'admin@company.com'),
('user-2', 'john.sales', 'john@company.com'),
('user-3', 'jane.viewer', 'jane@company.com');

-- User-Role mappings
INSERT INTO user_role_mappings (user_role_id, user_id, role_id) VALUES
('ur-1', 'user-1', 'role-1'),  -- admin has Admin role
('ur-2', 'user-2', 'role-2'),  -- john has Sales role
('ur-3', 'user-3', 'role-3');  -- jane has Viewer role

-- User-Role-Permission mappings
-- Admin role permissions (assigned to ur-1)
INSERT INTO user_role_permission_mappings (user_role_id, permission_id) VALUES
('ur-1', 'perm-1'), ('ur-1', 'perm-2'), ('ur-1', 'perm-3'), ('ur-1', 'perm-4'),
('ur-1', 'perm-5'), ('ur-1', 'perm-6'), ('ur-1', 'perm-7'), ('ur-1', 'perm-8'),
('ur-1', 'perm-9');

-- Sales role permissions (assigned to ur-2)
INSERT INTO user_role_permission_mappings (user_role_id, permission_id) VALUES
('ur-2', 'perm-5'), ('ur-2', 'perm-6'), ('ur-2', 'perm-8');

-- Viewer role permissions (assigned to ur-3)
INSERT INTO user_role_permission_mappings (user_role_id, permission_id) VALUES
('ur-3', 'perm-1'), ('ur-3', 'perm-5'), ('ur-3', 'perm-8');
```

---

## 4. Architecture Overview

### 4.1 System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHORIZATION ARCHITECTURE                              │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           REACT FRONTEND                                │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │ │
│  │  │                 │    │                 │    │                     │ │ │
│  │  │   Redux Store   │◀───│ permissionSlice │◀───│ GET /api/auth/      │ │ │
│  │  │                 │    │                 │    │     permissions     │ │ │
│  │  │ permissions: [] │    │ - permissions   │    │                     │ │ │
│  │  │                 │    │ - isLoading     │    └─────────────────────┘ │ │
│  │  └────────┬────────┘    │ - error         │                            │ │
│  │           │             │                 │                            │ │
│  │           │             └─────────────────┘                            │ │
│  │           │                                                            │ │
│  │           ▼                                                            │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │ │
│  │  │                     Permission Utilities                         │  │ │
│  │  │                                                                  │  │ │
│  │  │  ┌─────────────────┐         ┌─────────────────────────────┐    │  │ │
│  │  │  │ usePermission() │         │ <Can permission="...">     │    │  │ │
│  │  │  │                 │         │   <ProtectedComponent />   │    │  │ │
│  │  │  │ Hook for logic  │         │ </Can>                     │    │  │ │
│  │  │  │                 │         │                             │    │  │ │
│  │  │  │ Returns boolean │         │ Wrapper for JSX             │    │  │ │
│  │  │  └─────────────────┘         └─────────────────────────────┘    │  │ │
│  │  └─────────────────────────────────────────────────────────────────┘  │ │
│  │                                                                         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                           BACKEND (Lambda)                              │ │
│  │                                                                         │ │
│  │  GET /api/auth/permissions                                              │ │
│  │        │                                                                │ │
│  │        ▼                                                                │ │
│  │  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────────┐ │ │
│  │  │ @Authenticated  │───▶│ AuthController  │───▶│ PermissionService   │ │ │
│  │  │ (from JWT)      │    │ .getPermissions │    │ .getUserPermissions │ │ │
│  │  └─────────────────┘    └─────────────────┘    └──────────┬──────────┘ │ │
│  │                                                            │            │ │
│  │                                                            ▼            │ │
│  │                                               ┌─────────────────────┐   │ │
│  │                                               │     Database        │   │ │
│  │                                               │  (Prisma Query)     │   │ │
│  │                                               └─────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 File Structure

```
api/
├── src/
│   ├── controllers/
│   │   └── AuthController.ts        # MODIFY: Add getPermissions endpoint
│   ├── services/
│   │   └── AuthService.ts           # MODIFY: Add getUserPermissions method
│   └── repositories/
│       └── AuthRepository.ts        # MODIFY: Add permission query method

ui/
├── src/
│   ├── store/
│   │   ├── permissionSlice.ts       # NEW: Redux slice for permissions
│   │   ├── api/
│   │   │   └── authApi.ts           # MODIFY: Add getPermissions query
│   │   └── hooks.ts                 # MODIFY: Export permission hooks
│   ├── hooks/
│   │   └── usePermission.ts         # NEW: Permission check hook
│   ├── components/
│   │   └── Can.tsx                  # NEW: Permission wrapper component
│   └── types/
│       └── permissions.ts           # NEW: Permission type definitions
```

### 4.3 Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PERMISSION DATA FLOW                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 1. AFTER SUCCESSFUL LOGIN                                                ││
│  │                                                                          ││
│  │    Login.tsx                                                             ││
│  │        │                                                                 ││
│  │        ├── 1a. Login success → dispatch(setIsLoggedIn(true))             ││
│  │        │                                                                 ││
│  │        └── 1b. Trigger permission fetch → useGetPermissionsQuery()       ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 2. FETCH PERMISSIONS FROM API                                            ││
│  │                                                                          ││
│  │    GET /api/auth/permissions                                             ││
│  │        │                                                                 ││
│  │        ├── Cookie: accessToken=... (automatically sent)                  ││
│  │        │                                                                 ││
│  │        └── Response:                                                     ││
│  │            {                                                             ││
│  │              "success": true,                                            ││
│  │              "permissions": [                                            ││
│  │                "user:view", "user:create",                               ││
│  │                "po:view", "po:create", "po:approve",                     ││
│  │                "dashboard:view"                                          ││
│  │              ],                                                          ││
│  │              "roles": ["Admin", "Sales"]                                 ││
│  │            }                                                             ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 3. STORE IN REDUX                                                        ││
│  │                                                                          ││
│  │    permissionSlice.ts                                                    ││
│  │        │                                                                 ││
│  │        └── State:                                                        ││
│  │            {                                                             ││
│  │              permissions: ["user:view", "user:create", ...],             ││
│  │              roles: ["Admin", "Sales"],                                  ││
│  │              isLoading: false,                                           ││
│  │              isLoaded: true                                              ││
│  │            }                                                             ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                      │                                       │
│                                      ▼                                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 4. USE IN COMPONENTS                                                     ││
│  │                                                                          ││
│  │    // Using hook                                                         ││
│  │    const canCreate = usePermission('user:create');                       ││
│  │    if (canCreate) { /* show create button */ }                           ││
│  │                                                                          ││
│  │    // Using wrapper                                                      ││
│  │    <Can permission="user:create">                                        ││
│  │      <Button>Create User</Button>                                        ││
│  │    </Can>                                                                ││
│  │                                                                          ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Backend Implementation

### 5.1 Add Permission Query to Repository

**File:** `api/src/repositories/AuthRepository.ts`

Add a method to fetch all permissions for a user:

```typescript
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface IAuthRepository {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
  validatePassword(user: User, password: string): Promise<boolean>;
  findById(userId: string): Promise<User | null>;
  getUserPermissions(userId: string): Promise<UserPermissionsResult>;  // NEW
}

/**
 * Result type for user permissions query
 */
export interface UserPermissionsResult {
  permissions: string[];  // Array of permission names
  roles: string[];        // Array of role names (for display)
}

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(
    @inject(TYPES.PrismaClient)
    private prisma: PrismaClient
  ) {}

  // ... existing methods ...

  /**
   * Get all permissions for a user across all their active roles
   * 
   * This query:
   * 1. Finds all active UserRole entries for the user
   * 2. For each UserRole, finds all active UserRolePermission entries
   * 3. Collects all unique permission names
   * 
   * @param userId - The user's ID
   * @returns Object with permissions array and roles array
   */
  async getUserPermissions(userId: string): Promise<UserPermissionsResult> {
    // Query all user roles with their permissions
    const userRoles = await this.prisma.userRole.findMany({
      where: {
        userId: userId,
        isActive: true,
      },
      include: {
        role: {
          select: {
            roleName: true,
            isActive: true,
          },
        },
        userRolePermissions: {
          where: {
            isActive: true,
          },
          include: {
            permission: {
              select: {
                permissionName: true,
                isActive: true,
              },
            },
          },
        },
      },
    });

    // Extract unique permissions
    const permissionSet = new Set<string>();
    const roleSet = new Set<string>();

    for (const userRole of userRoles) {
      // Skip if role is inactive
      if (!userRole.role.isActive) continue;

      // Add role name
      roleSet.add(userRole.role.roleName);

      // Add all active permissions for this role
      for (const urp of userRole.userRolePermissions) {
        if (urp.permission.isActive) {
          permissionSet.add(urp.permission.permissionName);
        }
      }
    }

    return {
      permissions: Array.from(permissionSet).sort(),
      roles: Array.from(roleSet).sort(),
    };
  }
}
```

### 5.2 Add Permission Method to Service

**File:** `api/src/services/AuthService.ts`

Add a method to the AuthService:

```typescript
import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IAuthRepository, UserPermissionsResult } from '../repositories/AuthRepository';

export interface IAuthService {
  // ... existing methods ...
  getUserPermissions(userId: string): Promise<UserPermissionsResult>;  // NEW
}

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.AuthRepository) private authRepository: IAuthRepository
  ) {}

  // ... existing methods ...

  /**
   * Get all permissions for a user
   * 
   * @param userId - The authenticated user's ID (from JWT)
   * @returns Object with permissions and roles arrays
   */
  async getUserPermissions(userId: string): Promise<UserPermissionsResult> {
    return this.authRepository.getUserPermissions(userId);
  }
}
```

### 5.3 Add Permissions Endpoint to Controller

**File:** `api/src/controllers/AuthController.ts`

Add a new endpoint:

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Event,
  createSuccessResponse,
  createErrorResponse,
  Authenticated,
  CurrentUser,
} from '@oriana/shared';

@Controller({ path: '/api', lambdaName: 'auth' })
@injectable()
export class AuthController implements IAuthController {
  constructor(@inject(TYPES.AuthService) private authService: IAuthService) {}

  // ... existing endpoints ...

  /**
   * Get current user's permissions
   * 
   * GET /api/auth/permissions
   * Requires: Authentication (accessToken cookie)
   * 
   * Response:
   * {
   *   "success": true,
   *   "permissions": ["user:view", "user:create", ...],
   *   "roles": ["Admin", "Sales"]
   * }
   */
  @Get('/auth/permissions')
  @Authenticated()
  async getPermissions(
    @CurrentUser() user: { userId: string }
  ): Promise<APIGatewayProxyResult> {
    try {
      const result = await this.authService.getUserPermissions(user.userId);
      
      return createSuccessResponse({
        permissions: result.permissions,
        roles: result.roles,
      });
    } catch (error) {
      return createErrorResponse(error as Error);
    }
  }
}
```

### 5.4 API Response Format

The endpoint returns:

```json
{
  "success": true,
  "permissions": [
    "dashboard:view",
    "po:create",
    "po:view",
    "user:create",
    "user:delete",
    "user:view"
  ],
  "roles": [
    "Admin",
    "Sales"
  ]
}
```

---

## 6. Frontend Implementation

### 6.1 Create Permission Types

**File:** `ui/src/types/permissions.ts`

```typescript
/**
 * Permission type definitions
 */

/**
 * Response from GET /api/auth/permissions
 */
export interface PermissionsResponse {
  success: boolean;
  permissions: string[];
  roles: string[];
}

/**
 * Permission state in Redux
 */
export interface PermissionState {
  /** Array of permission names the user has */
  permissions: string[];
  
  /** Array of role names the user has */
  roles: string[];
  
  /** Whether permissions are currently being loaded */
  isLoading: boolean;
  
  /** Whether permissions have been loaded at least once */
  isLoaded: boolean;
  
  /** Error message if loading failed */
  error: string | null;
}

/**
 * Permission check options
 */
export interface PermissionCheckOptions {
  /** 
   * If true, user must have ALL specified permissions
   * If false, user must have ANY of the specified permissions
   * Default: false
   */
  requireAll?: boolean;
}
```

### 6.2 Add Permissions API Endpoint

**File:** `ui/src/store/api/authApi.ts`

```typescript
import { baseApi } from "./baseApi";
import { 
  LoginRequest, 
  LoginResponse, 
  UserProfile 
} from "../../types/orianaTypes";
import { PermissionsResponse } from "../../types/permissions";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    
    getMe: builder.query<UserProfile, void>({
      query: () => "/auth/me",
    }),
    
    // NEW: Get user permissions
    getPermissions: builder.query<PermissionsResponse, void>({
      query: () => "/auth/permissions",
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useGetPermissionsQuery,  // NEW
  useLazyGetPermissionsQuery,  // NEW: For manual triggering
} = authApi;
```

### 6.3 Create Permission Redux Slice

**File:** `ui/src/store/permissionSlice.ts`

```typescript
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from ".";
import { PermissionState } from "../types/permissions";

/**
 * Initial state for permissions
 */
const initialState: PermissionState = {
  permissions: [],
  roles: [],
  isLoading: false,
  isLoaded: false,
  error: null,
};

/**
 * Permission slice
 * 
 * Manages the user's permissions state in Redux.
 * Permissions are fetched after login and stored here for quick access.
 */
const permissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    /**
     * Set permissions from API response
     */
    setPermissions: (
      state,
      action: PayloadAction<{ permissions: string[]; roles: string[] }>
    ) => {
      state.permissions = action.payload.permissions;
      state.roles = action.payload.roles;
      state.isLoading = false;
      state.isLoaded = true;
      state.error = null;
    },

    /**
     * Set loading state
     */
    setPermissionsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error state
     */
    setPermissionsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear permissions (on logout)
     */
    clearPermissions: (state) => {
      state.permissions = [];
      state.roles = [];
      state.isLoading = false;
      state.isLoaded = false;
      state.error = null;
    },
  },
});

// ============================================================================
// SELECTORS
// ============================================================================

/**
 * Select all permissions
 */
export const selectPermissions = (state: RootState): string[] =>
  state.permission.permissions;

/**
 * Select all roles
 */
export const selectRoles = (state: RootState): string[] =>
  state.permission.roles;

/**
 * Select loading state
 */
export const selectPermissionsLoading = (state: RootState): boolean =>
  state.permission.isLoading;

/**
 * Select whether permissions have been loaded
 */
export const selectPermissionsLoaded = (state: RootState): boolean =>
  state.permission.isLoaded;

/**
 * Check if user has a specific permission
 * 
 * @example
 * const canCreateUser = useSelector((state) => selectHasPermission(state, 'user:create'));
 */
export const selectHasPermission = (
  state: RootState,
  permission: string
): boolean => state.permission.permissions.includes(permission);

/**
 * Check if user has ALL of the specified permissions
 * 
 * @example
 * const canManageUsers = useSelector((state) => 
 *   selectHasAllPermissions(state, ['user:create', 'user:delete'])
 * );
 */
export const selectHasAllPermissions = (
  state: RootState,
  permissions: string[]
): boolean => permissions.every((p) => state.permission.permissions.includes(p));

/**
 * Check if user has ANY of the specified permissions
 * 
 * @example
 * const canViewOrCreate = useSelector((state) => 
 *   selectHasAnyPermission(state, ['user:view', 'user:create'])
 * );
 */
export const selectHasAnyPermission = (
  state: RootState,
  permissions: string[]
): boolean => permissions.some((p) => state.permission.permissions.includes(p));

/**
 * Check if user has a specific role
 */
export const selectHasRole = (state: RootState, role: string): boolean =>
  state.permission.roles.includes(role);

// Export actions and reducer
export const {
  setPermissions,
  setPermissionsLoading,
  setPermissionsError,
  clearPermissions,
} = permissionSlice.actions;

export default permissionSlice.reducer;
```

### 6.4 Add Permission Slice to Store

**File:** `ui/src/store/index.ts`

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./api/baseApi";
import authReducer from "./authSlice";
import permissionReducer from "./permissionSlice";  // NEW
// ... other imports

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    auth: authReducer,
    permission: permissionReducer,  // NEW
    // ... other reducers
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 6.5 Create usePermission Hook

**File:** `ui/src/hooks/usePermission.ts`

```typescript
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  selectPermissions,
  selectHasPermission,
  selectHasAllPermissions,
  selectHasAnyPermission,
  selectPermissionsLoaded,
} from '../store/permissionSlice';

/**
 * Hook to check a single permission
 * 
 * @param permission - The permission to check (e.g., 'user:create')
 * @returns boolean - Whether the user has the permission
 * 
 * @example
 * const UserActions = () => {
 *   const canCreate = usePermission('user:create');
 *   const canDelete = usePermission('user:delete');
 * 
 *   return (
 *     <div>
 *       {canCreate && <Button>Create User</Button>}
 *       {canDelete && <Button danger>Delete User</Button>}
 *     </div>
 *   );
 * };
 */
export function usePermission(permission: string): boolean {
  return useSelector((state: RootState) => selectHasPermission(state, permission));
}

/**
 * Hook to check multiple permissions (ALL required)
 * 
 * @param permissions - Array of permissions that ALL must be present
 * @returns boolean - Whether the user has ALL permissions
 * 
 * @example
 * const canFullyManageUsers = usePermissions(['user:create', 'user:update', 'user:delete']);
 */
export function usePermissions(permissions: string[]): boolean {
  return useSelector((state: RootState) => selectHasAllPermissions(state, permissions));
}

/**
 * Hook to check multiple permissions (ANY required)
 * 
 * @param permissions - Array of permissions where at least ONE must be present
 * @returns boolean - Whether the user has ANY of the permissions
 * 
 * @example
 * const canModifyUsers = useAnyPermission(['user:create', 'user:update']);
 */
export function useAnyPermission(permissions: string[]): boolean {
  return useSelector((state: RootState) => selectHasAnyPermission(state, permissions));
}

/**
 * Hook to get all user permissions
 * 
 * @returns string[] - Array of all permission names
 * 
 * @example
 * const allPermissions = useAllPermissions();
 * console.log('User has permissions:', allPermissions);
 */
export function useAllPermissions(): string[] {
  return useSelector(selectPermissions);
}

/**
 * Hook to check if permissions have been loaded
 * 
 * @returns boolean - Whether permissions have been loaded
 * 
 * @example
 * const isLoaded = usePermissionsLoaded();
 * if (!isLoaded) return <Spinner />;
 */
export function usePermissionsLoaded(): boolean {
  return useSelector(selectPermissionsLoaded);
}

/**
 * Comprehensive permission hook with all utilities
 * 
 * @example
 * const { hasPermission, hasAll, hasAny, permissions, isLoaded } = usePermissionUtils();
 * 
 * if (hasPermission('user:create')) { ... }
 * if (hasAll(['user:create', 'user:delete'])) { ... }
 * if (hasAny(['user:view', 'admin:view'])) { ... }
 */
export function usePermissionUtils() {
  const permissions = useSelector(selectPermissions);
  const isLoaded = useSelector(selectPermissionsLoaded);

  return {
    /** All permission names the user has */
    permissions,
    
    /** Whether permissions have been loaded */
    isLoaded,
    
    /** Check if user has a specific permission */
    hasPermission: (permission: string): boolean =>
      permissions.includes(permission),
    
    /** Check if user has ALL specified permissions */
    hasAll: (perms: string[]): boolean =>
      perms.every((p) => permissions.includes(p)),
    
    /** Check if user has ANY of the specified permissions */
    hasAny: (perms: string[]): boolean =>
      perms.some((p) => permissions.includes(p)),
  };
}
```

### 6.6 Create Can Wrapper Component

**File:** `ui/src/components/Can.tsx`

```tsx
import React, { ReactNode } from 'react';
import { usePermission, usePermissions, useAnyPermission } from '../hooks/usePermission';

/**
 * Props for the Can component
 */
interface CanProps {
  /**
   * Single permission to check
   * Use this OR `permissions`, not both
   */
  permission?: string;

  /**
   * Multiple permissions to check
   * Use this OR `permission`, not both
   */
  permissions?: string[];

  /**
   * If true, user must have ALL permissions
   * If false, user must have ANY of the permissions
   * Only applies when using `permissions` prop
   * Default: false (ANY)
   */
  requireAll?: boolean;

  /**
   * Content to render if user has permission
   */
  children: ReactNode;

  /**
   * Content to render if user does NOT have permission
   * If not provided, nothing is rendered
   */
  fallback?: ReactNode;
}

/**
 * Permission-based conditional rendering component
 * 
 * Renders children only if the user has the required permission(s).
 * This is a declarative alternative to using the usePermission hook.
 * 
 * @example
 * // Single permission
 * <Can permission="user:create">
 *   <Button>Create User</Button>
 * </Can>
 * 
 * @example
 * // Multiple permissions (ANY)
 * <Can permissions={['user:create', 'user:update']}>
 *   <Button>Modify User</Button>
 * </Can>
 * 
 * @example
 * // Multiple permissions (ALL required)
 * <Can permissions={['user:create', 'user:delete']} requireAll>
 *   <Button>Full User Management</Button>
 * </Can>
 * 
 * @example
 * // With fallback
 * <Can permission="report:export" fallback={<Text>No export access</Text>}>
 *   <Button>Export Report</Button>
 * </Can>
 */
const Can: React.FC<CanProps> = ({
  permission,
  permissions,
  requireAll = false,
  children,
  fallback = null,
}) => {
  // Determine which check to use
  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = usePermission(permission);
  } else if (permissions && permissions.length > 0) {
    // Multiple permissions check
    if (requireAll) {
      hasAccess = usePermissions(permissions);
    } else {
      hasAccess = useAnyPermission(permissions);
    }
  } else {
    // No permission specified - deny by default
    console.warn('Can component used without permission or permissions prop');
    hasAccess = false;
  }

  // Render based on access
  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

export default Can;
```

### 6.7 Create Cannot Component (Inverse of Can)

**File:** `ui/src/components/Cannot.tsx`

```tsx
import React, { ReactNode } from 'react';
import { usePermission, usePermissions, useAnyPermission } from '../hooks/usePermission';

interface CannotProps {
  permission?: string;
  permissions?: string[];
  requireAll?: boolean;
  children: ReactNode;
}

/**
 * Inverse of Can component - renders when user DOES NOT have permission
 * 
 * Useful for showing messages or alternative content for unauthorized users.
 * 
 * @example
 * <Cannot permission="report:export">
 *   <Alert>You don't have permission to export reports. Contact admin.</Alert>
 * </Cannot>
 */
const Cannot: React.FC<CannotProps> = ({
  permission,
  permissions,
  requireAll = false,
  children,
}) => {
  let hasAccess = false;

  if (permission) {
    hasAccess = usePermission(permission);
  } else if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = usePermissions(permissions);
    } else {
      hasAccess = useAnyPermission(permissions);
    }
  }

  // Render when user does NOT have access
  if (!hasAccess) {
    return <>{children}</>;
  }

  return null;
};

export default Cannot;
```

### 6.8 Update Login to Fetch Permissions

**File:** `ui/src/pages/Login.tsx`

```tsx
import React from "react";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation, useLazyGetPermissionsQuery } from "../store/api/authApi";
import { addAuth, setIsLoggedIn } from "store/authSlice";
import { setPermissions, setPermissionsLoading } from "store/permissionSlice";
import { useDispatch } from "react-redux";

const { Title } = Typography;

interface LoginData {
  username: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [getPermissions] = useLazyGetPermissionsQuery();

  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const onFinish = async (values: LoginData) => {
    try {
      // Step 1: Login
      const loginResponse = await login({
        username: values.username,
        password: values.password,
      }).unwrap();

      // Step 2: Update auth state
      dispatch(addAuth({ 
        username: loginResponse.user.username,
        userId: loginResponse.user.id,
        email: loginResponse.user.email,
      }));
      dispatch(setIsLoggedIn(true));

      // Step 3: Fetch permissions
      dispatch(setPermissionsLoading(true));
      
      try {
        const permissionsResponse = await getPermissions().unwrap();
        
        dispatch(setPermissions({
          permissions: permissionsResponse.permissions,
          roles: permissionsResponse.roles,
        }));
      } catch (permError) {
        console.error('Failed to fetch permissions:', permError);
        // Don't block login if permissions fail - they can be retried
        message.warning('Could not load permissions. Some features may be limited.');
      }

      message.success("Login Successful!");
      navigate(from, { replace: true });
      
    } catch (error: any) {
      const errorMessage =
        error?.data?.error?.message ||
        error?.data?.message ||
        error?.message ||
        "Invalid credentials. Please try again.";
      message.error(errorMessage);
    }
  };

  return (
    <div style={{ /* ... existing styles ... */ }}>
      <Card style={{ width: 350 }}>
        <Title level={3}>Login</Title>
        <Form layout="vertical" onFinish={onFinish}>
          {/* ... existing form fields ... */}
          <Button 
            type="primary" 
            htmlType="submit" 
            block 
            loading={isLoginLoading}
          >
            Login
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
```

### 6.9 Clear Permissions on Logout

**File:** Update your logout logic

```tsx
import { useLogoutMutation } from '../store/api/authApi';
import { logout as logoutAction } from '../store/authSlice';
import { clearPermissions } from '../store/permissionSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const [logout, { isLoading }] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    
    // Clear Redux state
    dispatch(logoutAction());
    dispatch(clearPermissions());  // Clear permissions
    
    // Redirect to login
    navigate('/');
  };

  return (
    <Button onClick={handleLogout} loading={isLoading}>
      Logout
    </Button>
  );
};
```

### 6.10 Export All Permission Utilities

**File:** `ui/src/hooks/index.ts`

```typescript
// Permission hooks
export {
  usePermission,
  usePermissions,
  useAnyPermission,
  useAllPermissions,
  usePermissionsLoaded,
  usePermissionUtils,
} from './usePermission';
```

**File:** `ui/src/components/index.ts`

```typescript
// Permission components
export { default as Can } from './Can';
export { default as Cannot } from './Cannot';
```

---

## 7. Usage Examples

### 7.1 Basic Button Visibility

```tsx
import React from 'react';
import { Button, Space } from 'antd';
import { usePermission } from '../hooks/usePermission';
import Can from '../components/Can';

/**
 * Example: User management actions
 */
const UserActions: React.FC = () => {
  // Method 1: Using hook
  const canCreate = usePermission('user:create');
  const canDelete = usePermission('user:delete');

  return (
    <Space>
      {/* Hook approach */}
      {canCreate && (
        <Button type="primary">Create User</Button>
      )}
      
      {canDelete && (
        <Button danger>Delete User</Button>
      )}
      
      {/* Wrapper approach */}
      <Can permission="user:update">
        <Button>Edit User</Button>
      </Can>
    </Space>
  );
};
```

### 7.2 Table Action Column

```tsx
import React from 'react';
import { Table, Button, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { usePermission } from '../hooks/usePermission';

interface User {
  id: string;
  username: string;
  email: string;
}

const UserTable: React.FC<{ users: User[] }> = ({ users }) => {
  const canView = usePermission('user:view');
  const canEdit = usePermission('user:update');
  const canDelete = usePermission('user:delete');

  const columns = [
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          {canView && (
            <Button 
              icon={<EyeOutlined />} 
              onClick={() => viewUser(record.id)}
            />
          )}
          
          {canEdit && (
            <Button 
              icon={<EditOutlined />} 
              onClick={() => editUser(record.id)}
            />
          )}
          
          {canDelete && (
            <Popconfirm
              title="Delete this user?"
              onConfirm={() => deleteUser(record.id)}
            >
              <Button danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} />;
};
```

### 7.3 Sidebar Menu Filtering

```tsx
import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { usePermission } from '../hooks/usePermission';

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  permission?: string;  // Optional - if not set, always visible
}

const allMenuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: 'Dashboard',
    path: '/dashboard',
    permission: 'dashboard:view',
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: 'User Management',
    path: '/user-management',
    permission: 'user:view',
  },
  {
    key: 'orders',
    icon: <ShoppingCartOutlined />,
    label: 'Purchase Orders',
    path: '/create-po',
    permission: 'po:view',
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    path: '/settings',
    permission: 'settings:view',
  },
];

const SidebarMenu: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermissionUtils();

  // Filter menu items based on permissions
  const visibleMenuItems = allMenuItems.filter((item) => {
    // If no permission required, always show
    if (!item.permission) return true;
    
    // Check if user has the required permission
    return hasPermission(item.permission);
  });

  const menuItems = visibleMenuItems.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => navigate(item.path),
  }));

  return (
    <Menu
      mode="inline"
      items={menuItems}
      style={{ height: '100%' }}
    />
  );
};

export default SidebarMenu;
```

### 7.4 Form Field Visibility

```tsx
import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import Can from '../components/Can';
import { usePermission } from '../hooks/usePermission';

const UserForm: React.FC = () => {
  const canAssignRoles = usePermission('role:assign');
  const canSetAdmin = usePermission('user:set-admin');

  return (
    <Form layout="vertical">
      <Form.Item label="Username" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true }]}>
        <Input type="email" />
      </Form.Item>

      {/* Only show role selector if user can assign roles */}
      <Can permission="role:assign">
        <Form.Item label="Role" name="roleId">
          <Select placeholder="Select role">
            <Select.Option value="role-1">Admin</Select.Option>
            <Select.Option value="role-2">User</Select.Option>
            <Select.Option value="role-3">Viewer</Select.Option>
          </Select>
        </Form.Item>
      </Can>

      {/* Only show admin checkbox if user has special permission */}
      {canSetAdmin && (
        <Form.Item name="isAdmin" valuePropName="checked">
          <Checkbox>Grant admin privileges</Checkbox>
        </Form.Item>
      )}

      <Button type="primary" htmlType="submit">
        Save User
      </Button>
    </Form>
  );
};
```

### 7.5 Page-Level Access Control

```tsx
import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { usePermission, usePermissionsLoaded } from '../hooks/usePermission';
import Can from '../components/Can';

/**
 * Higher-order component for page-level permission check
 */
interface RequirePermissionProps {
  permission: string;
  children: React.ReactNode;
}

const RequirePermission: React.FC<RequirePermissionProps> = ({ 
  permission, 
  children 
}) => {
  const hasPermission = usePermission(permission);
  const isLoaded = usePermissionsLoaded();
  const navigate = useNavigate();

  // Wait for permissions to load
  if (!isLoaded) {
    return <div>Loading...</div>;  // Or a spinner
  }

  // If no permission, show access denied
  if (!hasPermission) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle="You don't have permission to access this page."
        extra={
          <Button type="primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        }
      />
    );
  }

  return <>{children}</>;
};

// Usage in a page component
const AdminSettingsPage: React.FC = () => {
  return (
    <RequirePermission permission="settings:admin">
      <div>
        <h1>Admin Settings</h1>
        {/* Admin settings content */}
      </div>
    </RequirePermission>
  );
};
```

### 7.6 Conditional Form Submission

```tsx
import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { usePermission } from '../hooks/usePermission';

const OrderForm: React.FC = () => {
  const canCreate = usePermission('po:create');
  const canApprove = usePermission('po:approve');

  const onFinish = async (values: any) => {
    if (!canCreate) {
      message.error('You do not have permission to create orders');
      return;
    }

    // Create order logic...
  };

  const onApprove = async () => {
    if (!canApprove) {
      message.error('You do not have permission to approve orders');
      return;
    }

    // Approve order logic...
  };

  return (
    <Form onFinish={onFinish}>
      {/* Form fields */}
      
      <div style={{ display: 'flex', gap: 8 }}>
        <Can permission="po:create">
          <Button type="primary" htmlType="submit">
            Create Order
          </Button>
        </Can>
        
        <Can permission="po:approve">
          <Button onClick={onApprove}>
            Create & Approve
          </Button>
        </Can>
      </div>
    </Form>
  );
};
```

### 7.7 Debug Component (Development Only)

```tsx
import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { useAllPermissions, usePermissionUtils } from '../hooks/usePermission';
import { useSelector } from 'react-redux';
import { selectRoles } from '../store/permissionSlice';

const { Title, Text } = Typography;

/**
 * Debug component to show current user permissions
 * Only use in development!
 */
const PermissionDebugger: React.FC = () => {
  const permissions = useAllPermissions();
  const roles = useSelector(selectRoles);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card 
      title="Permission Debugger" 
      size="small"
      style={{ 
        position: 'fixed', 
        bottom: 16, 
        right: 16, 
        width: 300,
        maxHeight: 400,
        overflow: 'auto',
        zIndex: 9999,
      }}
    >
      <Title level={5}>Roles:</Title>
      <div style={{ marginBottom: 16 }}>
        {roles.map((role) => (
          <Tag color="blue" key={role}>{role}</Tag>
        ))}
      </div>

      <Title level={5}>Permissions ({permissions.length}):</Title>
      <div>
        {permissions.map((perm) => (
          <Tag key={perm} style={{ marginBottom: 4 }}>{perm}</Tag>
        ))}
      </div>
    </Card>
  );
};

export default PermissionDebugger;
```

---

## 8. Best Practices

### 8.1 Permission Naming Conventions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERMISSION NAMING BEST PRACTICES                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ✅ DO:                                                                      │
│  ─────                                                                       │
│  • Use lowercase with colons: user:create, po:view                           │
│  • Be consistent: always resource:action format                              │
│  • Use common actions: view, create, update, delete, manage                  │
│  • Group related permissions: user:*, po:*, report:*                         │
│  • Document each permission's purpose                                        │
│                                                                              │
│  ❌ DON'T:                                                                   │
│  ───────                                                                     │
│  • Mix formats: createUser, USER_CREATE, user.create                         │
│  • Use vague names: access, admin, full                                      │
│  • Create too granular permissions: user:view:name:only                      │
│  • Hardcode permission strings in multiple places                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Create Permission Constants

**File:** `ui/src/constants/permissions.ts`

```typescript
/**
 * Permission constants
 * 
 * Define all permissions here to:
 * 1. Avoid typos in permission strings
 * 2. Get autocomplete in IDE
 * 3. Single source of truth
 */
export const PERMISSIONS = {
  // User management
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Purchase Orders
  PO_VIEW: 'po:view',
  PO_CREATE: 'po:create',
  PO_UPDATE: 'po:update',
  PO_DELETE: 'po:delete',
  PO_APPROVE: 'po:approve',

  // Roles
  ROLE_VIEW: 'role:view',
  ROLE_MANAGE: 'role:manage',

  // Dashboard
  DASHBOARD_VIEW: 'dashboard:view',

  // Reports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_ADMIN: 'settings:admin',
} as const;

// Type for permission values
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
```

**Usage:**

```tsx
import { PERMISSIONS } from '../constants/permissions';
import { usePermission } from '../hooks/usePermission';
import Can from '../components/Can';

// With hook
const canCreate = usePermission(PERMISSIONS.USER_CREATE);

// With component
<Can permission={PERMISSIONS.USER_DELETE}>
  <Button danger>Delete</Button>
</Can>
```

### 8.3 Performance Considerations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PERFORMANCE BEST PRACTICES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. PERMISSION LOOKUP IS O(n)                                                │
│     • permissions.includes(permission) scans the array                       │
│     • For 10-50 permissions, this is negligible                              │
│     • If you have 100+ permissions, consider using a Set                     │
│                                                                              │
│  2. DON'T CALL API ON EVERY CHECK                                            │
│     • Load permissions once after login                                      │
│     • Store in Redux, check from Redux                                       │
│     • Only reload on refresh or role change                                  │
│                                                                              │
│  3. MEMOIZE COMPLEX PERMISSION LOGIC                                         │
│     ```tsx                                                                   │
│     const canManageUsers = useMemo(                                          │
│       () => hasAll(['user:create', 'user:update', 'user:delete']),           │
│       [permissions]                                                          │
│     );                                                                       │
│     ```                                                                      │
│                                                                              │
│  4. AVOID PERMISSION CHECKS IN LOOPS                                         │
│     ```tsx                                                                   │
│     // ❌ Bad - checks permission on every render of every row               │
│     {items.map(item => (                                                     │
│       <Can permission="item:delete"><DeleteBtn /></Can>                      │
│     ))}                                                                      │
│                                                                              │
│     // ✅ Good - check once, use the result                                  │
│     const canDelete = usePermission('item:delete');                          │
│     {items.map(item => (                                                     │
│       canDelete && <DeleteBtn />                                             │
│     ))}                                                                      │
│     ```                                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.4 Security Reminders

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SECURITY REMINDERS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ⚠️ IMPORTANT: UI PERMISSION CHECKS ARE NOT SECURITY                         │
│                                                                              │
│  Frontend permission checks only improve USER EXPERIENCE by:                 │
│  • Hiding buttons users can't use                                            │
│  • Reducing confusion                                                        │
│  • Preventing unnecessary API calls                                          │
│                                                                              │
│  A malicious user CAN:                                                       │
│  • Inspect the DOM and find hidden elements                                  │
│  • Modify Redux state to add permissions                                     │
│  • Call API endpoints directly                                               │
│                                                                              │
│  REAL SECURITY must be enforced on the BACKEND:                              │
│  • @Authenticated decorator ensures user is logged in                        │
│  • For sensitive operations, consider adding @RequirePermission              │
│    decorator in the future                                                   │
│  • Always validate permissions server-side for critical actions              │
│                                                                              │
│  Current approach (UI-only) is suitable for:                                 │
│  • Internal business applications                                            │
│  • Trusted user environments                                                 │
│  • When combined with @Authenticated backend checks                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Troubleshooting

### 9.1 Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Permissions not loading | API call fails | Check network tab, verify endpoint exists |
| User sees everything | Permissions array empty | Check if permissions were fetched after login |
| Can component always hidden | Wrong permission string | Check for typos, use constants |
| Permissions reset on refresh | Not persisted | Consider localStorage or re-fetch on mount |
| Hook returns false always | Permissions not in Redux | Verify login flow sets permissions |

### 9.2 Debugging Steps

**Step 1: Check if permissions are in Redux**

```tsx
// Add this to any component temporarily
import { useSelector } from 'react-redux';
import { selectPermissions } from '../store/permissionSlice';

const Component = () => {
  const permissions = useSelector(selectPermissions);
  console.log('Current permissions:', permissions);
  // ...
};
```

**Step 2: Check API response**

1. Open DevTools → Network tab
2. Look for `/api/auth/permissions` request
3. Check response body has permissions array

**Step 3: Verify permission string matches**

```tsx
// If this returns false unexpectedly:
const canCreate = usePermission('user:create');

// Check what permissions are actually stored:
const allPermissions = useAllPermissions();
console.log('All permissions:', allPermissions);
console.log('Looking for: user:create');
console.log('Includes?:', allPermissions.includes('user:create'));
```

### 9.3 Handling Permission Loading State

```tsx
import React from 'react';
import { Spin } from 'antd';
import { usePermissionsLoaded } from '../hooks/usePermission';
import Can from '../components/Can';

const ProtectedContent: React.FC = () => {
  const isLoaded = usePermissionsLoaded();

  // Show loading while permissions are being fetched
  if (!isLoaded) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" />
        <p>Loading permissions...</p>
      </div>
    );
  }

  // Once loaded, show permission-based content
  return (
    <div>
      <Can permission="dashboard:view">
        <Dashboard />
      </Can>
    </div>
  );
};
```

---

## 10. Checklist

### 10.1 Implementation Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       IMPLEMENTATION CHECKLIST                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Backend                                                                     │
│  ───────                                                                     │
│  □ Add getUserPermissions method to AuthRepository                           │
│  □ Add getUserPermissions method to AuthService                              │
│  □ Add GET /api/auth/permissions endpoint to AuthController                  │
│  □ Test endpoint returns correct permissions                                 │
│                                                                              │
│  Frontend - Store                                                            │
│  ────────────────                                                            │
│  □ Create types/permissions.ts                                               │
│  □ Create store/permissionSlice.ts                                           │
│  □ Add permissionReducer to store                                            │
│  □ Add getPermissions to authApi.ts                                          │
│                                                                              │
│  Frontend - Hooks & Components                                               │
│  ─────────────────────────────                                               │
│  □ Create hooks/usePermission.ts                                             │
│  □ Create components/Can.tsx                                                 │
│  □ Create components/Cannot.tsx (optional)                                   │
│  □ Create constants/permissions.ts                                           │
│                                                                              │
│  Frontend - Integration                                                      │
│  ───────────────────────                                                     │
│  □ Update Login.tsx to fetch permissions after login                         │
│  □ Update logout logic to clear permissions                                  │
│  □ Add permission checks to components                                       │
│                                                                              │
│  Testing                                                                     │
│  ───────                                                                     │
│  □ Test login fetches permissions                                            │
│  □ Test Can component hides/shows correctly                                  │
│  □ Test usePermission hook returns correct values                            │
│  □ Test logout clears permissions                                            │
│  □ Test with different user roles                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.2 Files to Create/Modify Summary

| File | Action | Purpose |
|------|--------|---------|
| `api/src/repositories/AuthRepository.ts` | Modify | Add `getUserPermissions` method |
| `api/src/services/AuthService.ts` | Modify | Add `getUserPermissions` method |
| `api/src/controllers/AuthController.ts` | Modify | Add `/auth/permissions` endpoint |
| `ui/src/types/permissions.ts` | Create | Permission type definitions |
| `ui/src/store/permissionSlice.ts` | Create | Redux slice for permissions |
| `ui/src/store/index.ts` | Modify | Add permission reducer |
| `ui/src/store/api/authApi.ts` | Modify | Add getPermissions query |
| `ui/src/hooks/usePermission.ts` | Create | Permission check hooks |
| `ui/src/components/Can.tsx` | Create | Permission wrapper component |
| `ui/src/components/Cannot.tsx` | Create | Inverse permission wrapper |
| `ui/src/constants/permissions.ts` | Create | Permission constants |
| `ui/src/pages/Login.tsx` | Modify | Fetch permissions after login |

---

## 11. Summary

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     AUTHORIZATION SYSTEM SUMMARY                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  What We Built                                                               │
│  ═════════════                                                               │
│  • Backend endpoint to fetch user permissions                                │
│  • Redux slice to store permissions                                          │
│  • Hooks for permission checks in logic                                      │
│  • Wrapper components for declarative permission checks                      │
│                                                                              │
│  How It Works                                                                │
│  ════════════                                                                │
│  1. User logs in successfully                                                │
│  2. Frontend calls GET /api/auth/permissions                                 │
│  3. Backend queries all permissions for user's roles                         │
│  4. Permissions stored in Redux as string array                              │
│  5. Components use usePermission() or <Can> to check                         │
│  6. UI shows/hides based on permissions                                      │
│                                                                              │
│  Key Components                                                              │
│  ══════════════                                                              │
│  • usePermission('user:create')     → returns boolean                        │
│  • usePermissions(['a', 'b'])       → all required                           │
│  • useAnyPermission(['a', 'b'])     → any required                           │
│  • <Can permission="...">           → wrapper component                      │
│  • PERMISSIONS.USER_CREATE          → type-safe constant                     │
│                                                                              │
│  Remember                                                                    │
│  ════════                                                                    │
│  • UI checks are for UX, not security                                        │
│  • Backend @Authenticated is the real protection                             │
│  • Use permission constants to avoid typos                                   │
│  • Clear permissions on logout                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

**Questions?** Refer to:
- [SECURITY_IMPLEMENTATION.md](./SECURITY_IMPLEMENTATION.md) - JWT Authentication (prerequisite)
- [OWASP Authorization Cheatsheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
- [React Redux Documentation](https://react-redux.js.org/)

