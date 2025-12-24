/**
 * CreatePO Lambda Configuration
 *
 * This file defines the lambda configuration for the Purchase Order API.
 * It registers the controller, services, and repositories with the DI container.
 *
 * Handles all PO operations:
 * - POST /api/po - Create new PO
 * - GET /api/po - List all POs
 * - GET /api/po/{poId} - Get PO by ID
 * - PUT /api/po/{poId} - Update PO
 * - DELETE /api/po/{poId} - Delete PO
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
  name: 'CreatePO',
  controllers: [POController],
  bindings: [
    { symbol: TYPES.POService, implementation: POService },
    { symbol: TYPES.PORepository, implementation: PORepository },
    // PrismaClient is automatically bound by the framework
  ],
  prismaSymbol: TYPES.PrismaClient,
});

// Export the Lambda handler
export const handler = createLambdaHandler('CreatePO');
