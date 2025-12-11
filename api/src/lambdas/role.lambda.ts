import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';

import { RoleController } from '../controllers/RoleController';
import { RoleService } from '../services/RoleService';
import { RoleRepository } from '../repositories/RoleRepository';

defineLambda({
  name: 'role',
  controllers: [RoleController],
  bindings: [
    { symbol: TYPES.RoleService, implementation: RoleService },
    { symbol: TYPES.RoleRepository, implementation: RoleRepository },
  ],
  prismaSymbol: TYPES.PrismaClient,
});

export const handler = createLambdaHandler('role');
