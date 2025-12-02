import 'reflect-metadata';
import { Container } from 'inversify';
import { Sequelize } from 'sequelize';
import { TYPES } from '../types/types';
import { POController } from '../controllers/POController';
import { POService, IPOService } from '../services/POService';
import { PORepository, IPORepository } from '../repositories/PORepository';
import { getSequelize, logger } from '@oriana/shared';
import { initializeModels } from '../models';

let container: Container | null = null;
let sequelizeInstance: Sequelize | null = null;

export const createContainer = async (): Promise<Container> => {
  if (container && sequelizeInstance) {
    try {
      await sequelizeInstance.authenticate({ logging: false });
      return container;
    } catch (error) {
      logger.warn('Container connection unhealthy, recreating...');
      container = null;
      sequelizeInstance = null;
    }
  }

  const startTime = Date.now();
  container = new Container({ defaultScope: 'Singleton' });

  sequelizeInstance = await getSequelize();
  initializeModels(sequelizeInstance);

  container.bind<Sequelize>(TYPES.Sequelize).toConstantValue(sequelizeInstance);
  container.bind<IPORepository>(TYPES.PORepository).to(PORepository).inSingletonScope();
  container.bind<IPOService>(TYPES.POService).to(POService).inSingletonScope();
  container.bind<POController>(POController).toSelf().inSingletonScope();

  const duration = Date.now() - startTime;
  logger.info(`DI container created in ${duration}ms`);

  return container;
};

export const getContainer = (): Container => {
  if (!container) {
    throw new Error('Container not initialized. Call createContainer() first.');
  }
  return container;
};

export const resetContainer = (): void => {
  container = null;
  sequelizeInstance = null;
};
