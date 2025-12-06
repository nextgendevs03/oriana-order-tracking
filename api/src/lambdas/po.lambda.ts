/**
 * PO Lambda Configuration
 *
 * This file defines the lambda configuration for the Purchase Order API.
 * It registers the controller, services, and repositories with the DI container.
 *
 * To create a new lambda, copy this file and update:
 * 1. The lambda name
 * 2. The controller import and reference
 * 3. The service/repository bindings
 */

import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';

// Import controller (triggers decorator registration)
import { POController } from '../controllers/POController';

// Import services and repositories
import { POService } from '../services/POService';
import { PORepository } from '../repositories/PORepository';

// Define and register the lambda configuration
defineLambda({
  name: 'po',
  controllers: [POController],
  bindings: [
    { symbol: TYPES.POService, implementation: POService },
    { symbol: TYPES.PORepository, implementation: PORepository },
    // PrismaClient is automatically bound by the framework
  ],
  prismaSymbol: TYPES.PrismaClient,
});

// Export the Lambda handler
export const handler = createLambdaHandler('po');
