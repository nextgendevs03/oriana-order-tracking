export const TYPES = {
  // Controllers
  POController: Symbol.for('POController'),
  AuthController: Symbol.for('AuthController'),
  PermissionController: Symbol.for('PermissionController'),
  RoleController: Symbol.for('RoleController'),
  UserController: Symbol.for('UserController'),

  // Services
  POService: Symbol.for('POService'),
  AuthService: Symbol.for('AuthService'),
  PORepository: Symbol.for('PORepository'),
  RoleService: Symbol.for('RoleService'),
  UserService: Symbol.for('UserService'),
  PermissionService: Symbol.for('PermissionService'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  UserRepository: Symbol.for('UserRepository'),

  // Database
  PrismaClient: Symbol.for('PrismaClient'),
};
