import {
  Model,
  DataTypes,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { POItem } from './POItem';

export class PurchaseOrder extends Model<
  InferAttributes<PurchaseOrder>,
  InferCreationAttributes<PurchaseOrder>
> {
  declare id: CreationOptional<string>;
  declare date: string;
  declare clientName: string;
  declare osgPiNo: number;
  declare osgPiDate: string;
  declare clientPoNo: number;
  declare clientPoDate: string;
  declare poStatus: string;
  declare noOfDispatch: string;
  declare clientAddress: string;
  declare clientContact: string;
  declare dispatchPlanDate: string;
  declare siteLocation: string;
  declare oscSupport: string;
  declare confirmDateOfDispatch: string;
  declare paymentStatus: string;
  declare remarks: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  // Associations
  declare poItems?: NonAttribute<POItem[]>;
  declare getPoItems: HasManyGetAssociationsMixin<POItem>;
  declare addPoItem: HasManyAddAssociationMixin<POItem, string>;
  declare createPoItem: HasManyCreateAssociationMixin<POItem>;

  static initModel(sequelize: Sequelize): typeof PurchaseOrder {
    PurchaseOrder.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
        },
        clientName: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'client_name',
        },
        osgPiNo: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'osg_pi_no',
        },
        osgPiDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'osg_pi_date',
        },
        clientPoNo: {
          type: DataTypes.INTEGER,
          allowNull: false,
          field: 'client_po_no',
        },
        clientPoDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'client_po_date',
        },
        poStatus: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'po_status',
        },
        noOfDispatch: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'no_of_dispatch',
        },
        clientAddress: {
          type: DataTypes.TEXT,
          allowNull: false,
          field: 'client_address',
        },
        clientContact: {
          type: DataTypes.STRING(100),
          allowNull: false,
          field: 'client_contact',
        },
        dispatchPlanDate: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'dispatch_plan_date',
        },
        siteLocation: {
          type: DataTypes.STRING(255),
          allowNull: false,
          field: 'site_location',
        },
        oscSupport: {
          type: DataTypes.STRING(20),
          allowNull: false,
          field: 'osc_support',
        },
        confirmDateOfDispatch: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: 'confirm_date_of_dispatch',
        },
        paymentStatus: {
          type: DataTypes.STRING(50),
          allowNull: false,
          field: 'payment_status',
        },
        remarks: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: 'purchase_orders',
        timestamps: true,
        underscored: true,
      }
    );

    return PurchaseOrder;
  }

  static associate(): void {
    PurchaseOrder.hasMany(POItem, {
      foreignKey: 'purchaseOrderId',
      as: 'poItems',
      onDelete: 'CASCADE',
    });
  }
}
