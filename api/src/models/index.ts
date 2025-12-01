import { Sequelize } from 'sequelize';
import { PurchaseOrder } from './PurchaseOrder';
import { POItem } from './POItem';

export { PurchaseOrder } from './PurchaseOrder';
export { POItem } from './POItem';

let modelsInitialized = false;

export const initializeModels = (sequelize: Sequelize): void => {
  if (modelsInitialized) {
    return;
  }

  // Initialize all models
  PurchaseOrder.initModel(sequelize);
  POItem.initModel(sequelize);

  // Setup associations
  PurchaseOrder.associate();
  POItem.associate();

  modelsInitialized = true;
};

export const getModels = () => ({
  PurchaseOrder,
  POItem,
});
