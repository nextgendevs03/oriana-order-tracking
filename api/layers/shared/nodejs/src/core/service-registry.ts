import 'reflect-metadata';
import { Container, interfaces } from 'inversify';
import { PrismaClient } from '@prisma/client';
import { getPrismaClient } from '../database';
import { logger } from '../utils/logger';

/**
 * Service binding configuration for DI container
 */
export interface ServiceBinding {
  /** Inversify symbol for the service */
  symbol: symbol;
  /** Implementation class */
  implementation: interfaces.Newable<unknown>;
  /** Scope: singleton (default) or transient */
  scope?: 'singleton' | 'transient';
}

/**
 * Lambda configuration for auto-wiring DI and handlers
 */
export interface LambdaConfig {
  /** Lambda name (used for routing and manifest) */
  name: string;
  /** Controller class (must have @Controller decorator) */
  controller: interfaces.Newable<unknown>;
  /** Service and repository bindings */
  bindings: ServiceBinding[];
  /** Symbol for PrismaClient in DI container (defaults to 'PrismaClient') */
  prismaSymbol?: symbol;
}

/**
 * Lambda Registry - manages lambda configurations for auto-wiring
 */
class LambdaRegistry {
  private configs: Map<string, LambdaConfig> = new Map();
  private containers: Map<string, Container> = new Map();
  private prismaInstances: Map<string, PrismaClient> = new Map();

  /**
   * Register a lambda configuration
   */
  register(config: LambdaConfig): void {
    if (this.configs.has(config.name)) {
      logger.warn(`Lambda '${config.name}' already registered, overwriting...`);
    }
    this.configs.set(config.name, config);
    logger.debug(`Lambda '${config.name}' registered with ${config.bindings.length} bindings`);
  }

  /**
   * Get lambda configuration by name
   */
  getConfig(name: string): LambdaConfig | undefined {
    return this.configs.get(name);
  }

  /**
   * Get all registered lambda names
   */
  getLambdaNames(): string[] {
    return Array.from(this.configs.keys());
  }

  /**
   * Create or get cached DI container for a lambda
   * Note: Prisma handles reconnection automatically, no need for health checks
   */
  async getContainer(lambdaName: string): Promise<Container> {
    // Return cached container (Prisma handles reconnection automatically)
    const cached = this.containers.get(lambdaName);
    if (cached) {
      return cached;
    }

    const config = this.configs.get(lambdaName);
    if (!config) {
      throw new Error(
        `Lambda '${lambdaName}' not registered. ` +
          `Available lambdas: ${this.getLambdaNames().join(', ') || 'none'}`
      );
    }

    return this.createContainer(config);
  }

  /**
   * Create a new DI container for a lambda config
   */
  private async createContainer(config: LambdaConfig): Promise<Container> {
    const startTime = Date.now();
    logger.info(`Creating DI container for '${config.name}'...`);

    const container = new Container({ defaultScope: 'Singleton' });

    // Initialize database connection
    const prisma = await getPrismaClient();

    // Bind PrismaClient
    const prismaSymbol = config.prismaSymbol || Symbol.for('PrismaClient');
    container.bind<PrismaClient>(prismaSymbol).toConstantValue(prisma);

    // Bind services and repositories
    for (const binding of config.bindings) {
      if (binding.scope === 'transient') {
        container.bind(binding.symbol).to(binding.implementation).inTransientScope();
      } else {
        container.bind(binding.symbol).to(binding.implementation).inSingletonScope();
      }
    }

    // Bind controller
    container.bind(config.controller).toSelf().inSingletonScope();

    // Cache container and prisma reference
    this.containers.set(config.name, container);
    this.prismaInstances.set(config.name, prisma);

    const duration = Date.now() - startTime;
    logger.info(`DI container for '${config.name}' created in ${duration}ms`);

    return container;
  }

  /**
   * Reset container cache (useful for testing)
   */
  resetContainer(lambdaName: string): void {
    this.containers.delete(lambdaName);
    this.prismaInstances.delete(lambdaName);
  }

  /**
   * Clear all registrations (useful for testing)
   */
  clear(): void {
    this.configs.clear();
    this.containers.clear();
    this.prismaInstances.clear();
  }
}

// Export singleton instance
export const lambdaRegistry = new LambdaRegistry();

/**
 * Helper function to define a lambda configuration
 * Use this in lambda config files for type safety
 *
 * @example
 * ```typescript
 * // src/lambdas/po.lambda.ts
 * import { defineLambda, createLambdaHandler } from '@oriana/shared';
 * import { TYPES } from '../types/types';
 * import { POController } from '../controllers/POController';
 * import { POService } from '../services/POService';
 * import { PORepository } from '../repositories/PORepository';
 *
 * defineLambda({
 *   name: 'po',
 *   controller: POController,
 *   bindings: [
 *     { symbol: TYPES.POService, implementation: POService },
 *     { symbol: TYPES.PORepository, implementation: PORepository },
 *   ],
 *   prismaSymbol: TYPES.PrismaClient,
 * });
 *
 * export const handler = createLambdaHandler('po');
 * ```
 */
export function defineLambda(config: LambdaConfig): LambdaConfig {
  // Register immediately when imported
  lambdaRegistry.register(config);
  return config;
}
