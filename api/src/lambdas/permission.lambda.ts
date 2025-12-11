import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';
import { PermissionController } from '../controllers/PermissionController';
import { PermissionService } from '../services/PermissionService';
import { PermissionRepository } from '../repositories/PermissionRepository';

defineLambda({
  name: 'permission',
  controllers: [PermissionController],
  bindings: [
    { symbol: TYPES.PermissionService, implementation: PermissionService },
    { symbol: TYPES.PermissionRepository, implementation: PermissionRepository },
  ],
  prismaSymbol: TYPES.PrismaClient,
});

export const handler = createLambdaHandler('permission');
