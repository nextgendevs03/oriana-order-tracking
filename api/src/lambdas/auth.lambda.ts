import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';
import { AuthController } from '../controllers/AuthController';
import { AuthService } from '../services/AuthService';
import { AuthRepository } from '../repositories/AuthRepository';

defineLambda({
  name: 'auth',
  controllers: [AuthController],
  bindings: [
    { symbol: (TYPES as any).AuthService, implementation: AuthService },
    { symbol: (TYPES as any).AuthRepository, implementation: AuthRepository },
  ],
});
export const handler = createLambdaHandler('auth');
