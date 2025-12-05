import { injectable, inject } from 'inversify';
import { PrismaClient, PurchaseOrder, POItem, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreatePORequest, UpdatePORequest, ListPORequest, POItemRequest } from '../schemas';

// Type for PurchaseOrder with included POItems
export type PurchaseOrderWithItems = PurchaseOrder & { poItems: POItem[] };

export interface IPORepository {
  create(data: CreatePORequest): Promise<PurchaseOrderWithItems>;
  findById(id: string): Promise<PurchaseOrderWithItems | null>;
  findAll(params: ListPORequest): Promise<{ rows: PurchaseOrderWithItems[]; count: number }>;
  update(id: string, data: UpdatePORequest): Promise<PurchaseOrderWithItems | null>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class PORepository implements IPORepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreatePORequest): Promise<PurchaseOrderWithItems> {
    const po = await this.prisma.purchaseOrder.create({
      data: {
        date: new Date(data.date),
        clientName: data.clientName,
        osgPiNo: data.osgPiNo,
        osgPiDate: new Date(data.osgPiDate),
        clientPoNo: data.clientPoNo,
        clientPoDate: new Date(data.clientPoDate),
        poStatus: data.poStatus,
        noOfDispatch: data.noOfDispatch,
        clientAddress: data.clientAddress,
        clientContact: data.clientContact,
        dispatchPlanDate: new Date(data.dispatchPlanDate),
        siteLocation: data.siteLocation,
        oscSupport: data.oscSupport,
        confirmDateOfDispatch: new Date(data.confirmDateOfDispatch),
        paymentStatus: data.paymentStatus,
        remarks: data.remarks,
        poItems: {
          create:
            data.poItems?.map((item: POItemRequest) => ({
              category: item.category,
              oemName: item.oemName,
              product: item.product,
              quantity: item.quantity,
              spareQuantity: item.spareQuantity,
              totalQuantity: item.totalQuantity,
              pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
              totalPrice: new Prisma.Decimal(item.totalPrice),
              warranty: item.warranty,
            })) || [],
        },
      },
      include: {
        poItems: true,
      },
    });

    return po;
  }

  async findById(id: string): Promise<PurchaseOrderWithItems | null> {
    return this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { poItems: true },
    });
  }

  async findAll(params: ListPORequest): Promise<{ rows: PurchaseOrderWithItems[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      clientName,
      poStatus,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PurchaseOrderWhereInput = {};
    if (clientName) {
      where.clientName = { contains: clientName, mode: 'insensitive' };
    }
    if (poStatus) {
      where.poStatus = poStatus;
    }

    // Build orderBy - map field names to Prisma format
    const orderByField = sortBy as keyof Prisma.PurchaseOrderOrderByWithRelationInput;
    const orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = {
      [orderByField]: sortOrder.toLowerCase() as Prisma.SortOrder,
    };

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.purchaseOrder.findMany({
        where,
        include: { poItems: true },
        orderBy,
        take: limit,
        skip,
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return { rows, count };
  }

  async update(id: string, data: UpdatePORequest): Promise<PurchaseOrderWithItems | null> {
    // Check if PO exists
    const existing = await this.prisma.purchaseOrder.findUnique({ where: { id } });
    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Prisma.PurchaseOrderUpdateInput = {};
    if (data.date !== undefined) updateData.date = new Date(data.date);
    if (data.clientName !== undefined) updateData.clientName = data.clientName;
    if (data.osgPiNo !== undefined) updateData.osgPiNo = data.osgPiNo;
    if (data.osgPiDate !== undefined) updateData.osgPiDate = new Date(data.osgPiDate);
    if (data.clientPoNo !== undefined) updateData.clientPoNo = data.clientPoNo;
    if (data.clientPoDate !== undefined) updateData.clientPoDate = new Date(data.clientPoDate);
    if (data.poStatus !== undefined) updateData.poStatus = data.poStatus;
    if (data.noOfDispatch !== undefined) updateData.noOfDispatch = data.noOfDispatch;
    if (data.clientAddress !== undefined) updateData.clientAddress = data.clientAddress;
    if (data.clientContact !== undefined) updateData.clientContact = data.clientContact;
    if (data.dispatchPlanDate !== undefined)
      updateData.dispatchPlanDate = new Date(data.dispatchPlanDate);
    if (data.siteLocation !== undefined) updateData.siteLocation = data.siteLocation;
    if (data.oscSupport !== undefined) updateData.oscSupport = data.oscSupport;
    if (data.confirmDateOfDispatch !== undefined)
      updateData.confirmDateOfDispatch = new Date(data.confirmDateOfDispatch);
    if (data.paymentStatus !== undefined) updateData.paymentStatus = data.paymentStatus;
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    // If poItems provided, delete existing and create new ones
    if (data.poItems) {
      await this.prisma.$transaction([
        this.prisma.pOItem.deleteMany({ where: { purchaseOrderId: id } }),
        this.prisma.purchaseOrder.update({
          where: { id },
          data: {
            ...updateData,
            poItems: {
              create: data.poItems.map((item: POItemRequest) => ({
                category: item.category,
                oemName: item.oemName,
                product: item.product,
                quantity: item.quantity,
                spareQuantity: item.spareQuantity,
                totalQuantity: item.totalQuantity,
                pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
                totalPrice: new Prisma.Decimal(item.totalPrice),
                warranty: item.warranty,
              })),
            },
          },
        }),
      ]);
    } else {
      await this.prisma.purchaseOrder.update({
        where: { id },
        data: updateData,
      });
    }

    // Return updated PO with items
    return this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: { poItems: true },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.purchaseOrder.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}
