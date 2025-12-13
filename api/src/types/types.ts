export const TYPES = {
  // Controllers
  POController: Symbol.for('POController'),
  AuthController: Symbol.for('AuthController'),
  PermissionController: Symbol.for('PermissionController'),
  RoleController: Symbol.for('RoleController'),
  UserController: Symbol.for('UserController'),
  CategoryController: Symbol.for('CategoryController'),
  OEMController: Symbol.for('OEMController'),
  ProductController: Symbol.for('ProductController'),

  // Services
  POService: Symbol.for('POService'),
  AuthService: Symbol.for('AuthService'),
  PORepository: Symbol.for('PORepository'),
  RoleService: Symbol.for('RoleService'),
  UserService: Symbol.for('UserService'),
  PermissionService: Symbol.for('PermissionService'),
  CategoryService: Symbol.for('CategoryService'),
  OEMService: Symbol.for('OEMService'),
  ProductService: Symbol.for('ProductService'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  UserRepository: Symbol.for('UserRepository'),
  CategoryRepository: Symbol.for('CategoryRepository'),
  OEMRepository: Symbol.for('OEMRepository'),
  ProductRepository: Symbol.for('ProductRepository'),

  // Database
  PrismaClient: Symbol.for('PrismaClient'),
};
