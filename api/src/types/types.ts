export const TYPES = {
  // Controllers
  POController: Symbol.for('POController'),
  AuthController: Symbol.for('AuthController'),

  // Services
  POService: Symbol.for('POService'),
  AuthService: Symbol.for('AuthService'),

  // Repositories
  PORepository: Symbol.for('PORepository'),
  AuthRepository: Symbol.for('AuthRepository'),

  // Database
  PrismaClient: Symbol.for('PrismaClient'),

  UserService: Symbol.for('UserService'),
  UserRepository: Symbol.for('UserRepository'),
  UserController: Symbol.for('UserController'),
};
