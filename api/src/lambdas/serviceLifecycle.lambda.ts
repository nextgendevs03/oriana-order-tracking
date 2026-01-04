/**
 * Service Lifecycle Lambda Configuration
 *
 * This file defines the lambda configuration for the Service Lifecycle APIs.
 * It registers the controllers, services, and repositories with the DI container.
 *
 * Handles Pre-Commissioning, Commissioning, and Warranty Certificate operations:
 *
 * Pre-Commissioning:
 * - POST /api/pre-commissioning - Create pre-commissioning records
 * - GET /api/pre-commissioning - List all with pagination
 * - GET /api/pre-commissioning/po/{poId} - Get by PO ID
 * - GET /api/pre-commissioning/po/{poId}/status - Get accordion status
 * - GET /api/pre-commissioning/po/{poId}/eligible - Get eligible serials
 * - GET /api/pre-commissioning/dispatch/{dispatchId} - Get by dispatch ID
 * - GET /api/pre-commissioning/{id} - Get by ID
 * - PUT /api/pre-commissioning/{id} - Update
 * - DELETE /api/pre-commissioning/{id} - Delete
 *
 * Commissioning:
 * - POST /api/commissioning - Create commissioning records
 * - GET /api/commissioning - List all with pagination
 * - GET /api/commissioning/po/{poId} - Get by PO ID
 * - GET /api/commissioning/po/{poId}/status - Get accordion status
 * - GET /api/commissioning/po/{poId}/eligible - Get eligible pre-commissionings
 * - GET /api/commissioning/{id} - Get by ID
 * - PUT /api/commissioning/{id} - Update
 * - DELETE /api/commissioning/{id} - Delete
 *
 * Warranty Certificate:
 * - POST /api/warranty-certificate - Create warranty certificate records
 * - GET /api/warranty-certificate - List all with pagination
 * - GET /api/warranty-certificate/po/{poId} - Get by PO ID
 * - GET /api/warranty-certificate/po/{poId}/status - Get accordion status
 * - GET /api/warranty-certificate/po/{poId}/eligible - Get eligible commissionings
 * - GET /api/warranty-certificate/{id} - Get by ID
 * - PUT /api/warranty-certificate/{id} - Update
 * - DELETE /api/warranty-certificate/{id} - Delete
 */

import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';

// Import controllers (triggers decorator registration)
import { PreCommissioningController } from '../controllers/PreCommissioningController';
import { CommissioningController } from '../controllers/CommissioningController';
import { WarrantyCertificateController } from '../controllers/WarrantyCertificateController';

// Import services
import { PreCommissioningService } from '../services/PreCommissioningService';
import { CommissioningService } from '../services/CommissioningService';
import { WarrantyCertificateService } from '../services/WarrantyCertificateService';

// Import repositories
import { PreCommissioningRepository } from '../repositories/PreCommissioningRepository';
import { CommissioningRepository } from '../repositories/CommissioningRepository';
import { WarrantyCertificateRepository } from '../repositories/WarrantyCertificateRepository';
import { FileRepository } from '../repositories/FileRepository';

// Define and register the lambda configuration
defineLambda({
  name: 'serviceLifecycle',
  controllers: [PreCommissioningController, CommissioningController, WarrantyCertificateController],
  bindings: [
    // Services
    { symbol: TYPES.PreCommissioningService, implementation: PreCommissioningService },
    { symbol: TYPES.CommissioningService, implementation: CommissioningService },
    { symbol: TYPES.WarrantyCertificateService, implementation: WarrantyCertificateService },

    // Repositories
    { symbol: TYPES.PreCommissioningRepository, implementation: PreCommissioningRepository },
    { symbol: TYPES.CommissioningRepository, implementation: CommissioningRepository },
    { symbol: TYPES.WarrantyCertificateRepository, implementation: WarrantyCertificateRepository },
    { symbol: TYPES.FileRepository, implementation: FileRepository },

    // PrismaClient is automatically bound by the framework
  ],
  prismaSymbol: TYPES.PrismaClient,
});

// Export the Lambda handler
export const handler = createLambdaHandler('serviceLifecycle');
