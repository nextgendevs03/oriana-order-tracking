import { injectable } from 'inversify';
import { Transaction } from 'sequelize';
import { PurchaseOrder, POItem } from '../models';
import { CreatePORequest, UpdatePORequest, ListPORequest, POItemRequest } from '../schemas';

export interface IPORepository {
  create(data: CreatePORequest, transaction?: Transaction): Promise<PurchaseOrder>;
  findById(id: string): Promise<PurchaseOrder | null>;
  findAll(params: ListPORequest): Promise<{ rows: PurchaseOrder[]; count: number }>;
  update(
    id: string,
    data: UpdatePORequest,
    transaction?: Transaction
  ): Promise<PurchaseOrder | null>;
  delete(id: string, transaction?: Transaction): Promise<boolean>;
}

@injectable()
export class PORepository implements IPORepository {
  async create(data: CreatePORequest, transaction?: Transaction): Promise<PurchaseOrder> {
    const po = await PurchaseOrder.create(
      {
        date: data.date,
        clientName: data.clientName,
        osgPiNo: data.osgPiNo,
        osgPiDate: data.osgPiDate,
        clientPoNo: data.clientPoNo,
        clientPoDate: data.clientPoDate,
        poStatus: data.poStatus,
        noOfDispatch: data.noOfDispatch,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        dispatchPlanDate: data.dispatchPlanDate,
        siteLocation: data.siteLocation,
        oscSupport: data.oscSupport,
        confirmDateOfDispatch: data.confirmDateOfDispatch,
        paymentStatus: data.paymentStatus,
        remarks: data.remarks,
      },
      { transaction }
    );

    // Create PO Items
    if (data.poItems && data.poItems.length > 0) {
      const poItems = data.poItems.map((item: POItemRequest) => ({
        purchaseOrderId: po.id,
        category: item.category,
        oemName: item.oemName,
        product: item.product,
        quantity: item.quantity,
        spareQuantity: item.spareQuantity,
        totalQuantity: item.totalQuantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice,
        warranty: item.warranty,
      }));

      await POItem.bulkCreate(poItems, { transaction });
    }

    // Reload with items
    const createdPO = await PurchaseOrder.findByPk(po.id, {
      include: [{ model: POItem, as: 'poItems' }],
      transaction,
    });

    return createdPO!;
  }

  async findById(id: string): Promise<PurchaseOrder | null> {
    return PurchaseOrder.findByPk(id, {
      include: [{ model: POItem, as: 'poItems' }],
    });
  }

  async findAll(params: ListPORequest): Promise<{ rows: PurchaseOrder[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      clientName,
      poStatus,
    } = params;

    const offset = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (clientName) {
      where.clientName = { $iLike: `%${clientName}%` };
    }
    if (poStatus) {
      where.poStatus = poStatus;
    }

    return PurchaseOrder.findAndCountAll({
      where,
      include: [{ model: POItem, as: 'poItems' }],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
      distinct: true,
    });
  }

  async update(
    id: string,
    data: UpdatePORequest,
    transaction?: Transaction
  ): Promise<PurchaseOrder | null> {
    const po = await PurchaseOrder.findByPk(id, { transaction });

    if (!po) {
      return null;
    }

    // Update PO fields
    const updateData: Partial<PurchaseOrder> = {};
    if (data.date !== undefined) updateData.date = data.date;
    if (data.clientName !== undefined) updateData.clientName = data.clientName;
    if (data.osgPiNo !== undefined) updateData.osgPiNo = data.osgPiNo;
    if (data.osgPiDate !== undefined) updateData.osgPiDate = data.osgPiDate;
    if (data.clientPoNo !== undefined) updateData.clientPoNo = data.clientPoNo;
    if (data.clientPoDate !== undefined) updateData.clientPoDate = data.clientPoDate;
    if (data.poStatus !== undefined) updateData.poStatus = data.poStatus;
    if (data.noOfDispatch !== undefined) updateData.noOfDispatch = data.noOfDispatch;
    if (data.clientAddress !== undefined) updateData.clientAddress = data.clientAddress;
    if (data.clientContact !== undefined) updateData.clientContact = data.clientContact;
    if (data.dispatchPlanDate !== undefined) updateData.dispatchPlanDate = data.dispatchPlanDate;
    if (data.siteLocation !== undefined) updateData.siteLocation = data.siteLocation;
    if (data.oscSupport !== undefined) updateData.oscSupport = data.oscSupport;
    if (data.confirmDateOfDispatch !== undefined)
      updateData.confirmDateOfDispatch = data.confirmDateOfDispatch;
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    await po.update(updateData, { transaction });

    // Update PO Items if provided
    if (data.poItems) {
      // Delete existing items and create new ones
      await POItem.destroy({ where: { purchaseOrderId: id }, transaction });

      const poItems = data.poItems.map((item: POItemRequest) => ({
        purchaseOrderId: id,
        category: item.category,
        oemName: item.oemName,
        product: item.product,
        quantity: item.quantity,
        spareQuantity: item.spareQuantity,
        totalQuantity: item.totalQuantity,
        pricePerUnit: item.pricePerUnit,
        totalPrice: item.totalPrice,
        warranty: item.warranty,
      }));

      await POItem.bulkCreate(poItems, { transaction });
    }

    // Reload with items
    return PurchaseOrder.findByPk(id, {
      include: [{ model: POItem, as: 'poItems' }],
      transaction,
    });
  }

  async delete(id: string, transaction?: Transaction): Promise<boolean> {
    const deleted = await PurchaseOrder.destroy({ where: { id }, transaction });
    return deleted > 0;
  }
}
