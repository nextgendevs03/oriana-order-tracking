import 'reflect-metadata';
import { defineLambda, createLambdaHandler } from '@oriana/shared';
import { TYPES } from '../types/types';

// --- Controllers ---
import { CategoryController } from '../controllers/CategoryController';
import { OEMController } from '../controllers/OEMController';
import { ProductController } from '../controllers/ProductController';

// --- Services ---
import { CategoryService } from '../services/CategoryService';
import { OEMService } from '../services/OEMService';
import { ProductService } from '../services/ProductService';

// --- Repositories ---
import { CategoryRepository } from '../repositories/CategoryRepository';
import { OEMRepository } from '../repositories/OEMRepository';
import { ProductRepository } from '../repositories/ProductRepository';

defineLambda({
  name: 'productManagement',

  controllers: [CategoryController, OEMController, ProductController],

  bindings: [
    // Category
    { symbol: TYPES.CategoryService, implementation: CategoryService },
    { symbol: TYPES.CategoryRepository, implementation: CategoryRepository },

    // OEM
    { symbol: TYPES.OEMService, implementation: OEMService },
    { symbol: TYPES.OEMRepository, implementation: OEMRepository },

    // Product
    { symbol: TYPES.ProductService, implementation: ProductService },
    { symbol: TYPES.ProductRepository, implementation: ProductRepository },
  ],

  prismaSymbol: TYPES.PrismaClient,
});

export const handler = createLambdaHandler('productManagement');
