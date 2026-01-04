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
  ClientController: Symbol.for('ClientController'),
  FileController: Symbol.for('FileController'),
  DispatchController: Symbol.for('DispatchController'),

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
  ClientService: Symbol.for('ClientService'),
  FileService: Symbol.for('FileService'),
  DispatchService: Symbol.for('DispatchService'),

  // Repositories
  AuthRepository: Symbol.for('AuthRepository'),
  PermissionRepository: Symbol.for('PermissionRepository'),
  RoleRepository: Symbol.for('RoleRepository'),
  UserRepository: Symbol.for('UserRepository'),
  CategoryRepository: Symbol.for('CategoryRepository'),
  OEMRepository: Symbol.for('OEMRepository'),
  ProductRepository: Symbol.for('ProductRepository'),
  ClientRepository: Symbol.for('ClientRepository'),
  FileRepository: Symbol.for('FileRepository'),
  DispatchRepository: Symbol.for('DispatchRepository'),

  // Database
  PrismaClient: Symbol.for('PrismaClient'),
};
