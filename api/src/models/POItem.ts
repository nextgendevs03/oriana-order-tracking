import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize';
import { PurchaseOrder } from './PurchaseOrder';

export class POItem extends Model<InferAttributes<POItem>, InferCreationAttributes<POItem>> {
  declare id: CreationOptional<string>;
  declare purchaseOrderId: ForeignKey<PurchaseOrder['id']>;
  declare category: string;
  declare oemName: string;
  declare product: string;
  declare quantity: number;
  declare spareQuantity: number;
  declare totalQuantity: number;
  declare pricePerUnit: number;
  declare totalPrice: number;
  declare warranty: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static initModel(sequelize: Sequelize): typeof POItem {
    POItem.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        purchaseOrderId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: 'purchase_order_id',
          references: {
            model: 'purchase_orders',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        category: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        oemName: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'oem_name',
        },
        product: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        spareQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: 'spare_quantity',
        },
        totalQuantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'total_quantity',
        },
        pricePerUnit: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          field: 'price_per_unit',
        },
        totalPrice: {
          type: DataTypes.DECIMAL(14, 2),
          allowNull: false,
          field: 'total_price',
        },
        warranty: {
          type: DataTypes.STRING(100),
          allowNull: false,
        },
        createdAt: {
          type: DataTypes.DATE,
          field: 'created_at',
        },
        updatedAt: {
          type: DataTypes.DATE,
          field: 'updated_at',
        },
      },
      {
        sequelize,
        tableName: 'po_items',
        timestamps: true,
        underscored: true,
      }
    );

    return POItem;
  }

  static associate(): void {
    POItem.belongsTo(PurchaseOrder, {
      foreignKey: 'purchaseOrderId',
      as: 'purchaseOrder',
    });
  }
}
