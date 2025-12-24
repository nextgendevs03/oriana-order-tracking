import { injectable, inject } from 'inversify';
import {
  PrismaClient,
  PurchaseOrder,
  POItem,
  Prisma,
  Category,
  OEM,
  Product,
  Client,
  User,
} from '@prisma/client';
import { TYPES } from '../types/types';
import { CreatePORequest, UpdatePORequest, ListPORequest, POItemRequest } from '../schemas';

// Type for POItem with included relations
export type POItemWithRelations = POItem & {
  category: Category;
  oem: OEM;
  product: Product;
};

// Type for PurchaseOrder with included relations
export type PurchaseOrderWithRelations = PurchaseOrder & {
  poItems: POItemWithRelations[];
  client: Client;
  assignedUser: User | null;
};

export interface IPORepository {
  create(data: CreatePORequest): Promise<PurchaseOrderWithRelations>;
  findById(poId: string): Promise<PurchaseOrderWithRelations | null>;
  findAll(params: ListPORequest): Promise<{ rows: PurchaseOrderWithRelations[]; count: number }>;
  update(poId: string, data: UpdatePORequest): Promise<PurchaseOrderWithRelations | null>;
  delete(poId: string): Promise<boolean>;
  generatePoId(): Promise<string>;
}

@injectable()
export class PORepository implements IPORepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  /**
   * Generate a unique PO ID in format OSG-XXXXXXXX (8 digits, zero-padded)
   * Uses a database sequence for guaranteed uniqueness
   */
  async generatePoId(): Promise<string> {
    // First, ensure the sequence exists (idempotent)
    await this.prisma.$executeRaw`
      CREATE SEQUENCE IF NOT EXISTS po_id_seq START WITH 1 INCREMENT BY 1
    `;

    // Get next value from sequence
    const result = await this.prisma.$queryRaw<[{ nextval: bigint }]>`
      SELECT nextval('po_id_seq')
    `;

    const seqNum = Number(result[0].nextval);
    return `OSG-${seqNum.toString().padStart(8, '0')}`;
  }

  // Include clause for fetching all relations
  private readonly includeRelations = {
    client: true,
    assignedUser: true,
    poItems: {
      include: {
        category: true,
        oem: true,
        product: true,
      },
    },
  };

  async create(data: CreatePORequest): Promise<PurchaseOrderWithRelations> {
    // Generate unique PO ID
    const poId = await this.generatePoId();

    const po = await this.prisma.purchaseOrder.create({
      data: {
        poId,
        poReceivedDate: new Date(data.poReceivedDate),
        clientId: data.clientId,
        osgPiNo: data.osgPiNo,
        osgPiDate: new Date(data.osgPiDate),
        clientPoNo: data.clientPoNo,
        clientPoDate: new Date(data.clientPoDate),
        poStatus: data.poStatus,
        noOfDispatch: data.noOfDispatch,
        assignDispatchTo: data.assignDispatchTo || null,
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
              categoryId: item.categoryId,
              oemId: item.oemId,
              productId: item.productId,
              quantity: item.quantity,
              spareQuantity: item.spareQuantity,
              totalQuantity: item.totalQuantity,
              pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
              totalPrice: new Prisma.Decimal(item.totalPrice),
              gstPercent: new Prisma.Decimal(item.gstPercent),
              finalPrice: new Prisma.Decimal(item.finalPrice),
              warranty: item.warranty,
            })) || [],
        },
      },
      include: this.includeRelations,
    });

    return po as PurchaseOrderWithRelations;
  }

  async findById(poId: string): Promise<PurchaseOrderWithRelations | null> {
    const po = await this.prisma.purchaseOrder.findUnique({
      where: { poId },
      include: this.includeRelations,
    });
    return po as PurchaseOrderWithRelations | null;
  }

  async findAll(
    params: ListPORequest
  ): Promise<{ rows: PurchaseOrderWithRelations[]; count: number }> {
    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      clientId,
      poStatus,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PurchaseOrderWhereInput = {};
    if (clientId) {
      where.clientId = clientId;
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
        include: this.includeRelations,
        orderBy,
        take: limit,
        skip,
      }),
      this.prisma.purchaseOrder.count({ where }),
    ]);

    return { rows: rows as PurchaseOrderWithRelations[], count };
  }

  async update(poId: string, data: UpdatePORequest): Promise<PurchaseOrderWithRelations | null> {
    // Check if PO exists
    const existing = await this.prisma.purchaseOrder.findUnique({ where: { poId } });
    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Prisma.PurchaseOrderUpdateInput = {};
    if (data.poReceivedDate !== undefined)
      updateData.poReceivedDate = new Date(data.poReceivedDate);
    if (data.clientId !== undefined) updateData.client = { connect: { clientId: data.clientId } };
    if (data.osgPiNo !== undefined) updateData.osgPiNo = data.osgPiNo;
    if (data.osgPiDate !== undefined) updateData.osgPiDate = new Date(data.osgPiDate);
    if (data.clientPoNo !== undefined) updateData.clientPoNo = data.clientPoNo;
    if (data.clientPoDate !== undefined) updateData.clientPoDate = new Date(data.clientPoDate);
    if (data.poStatus !== undefined) updateData.poStatus = data.poStatus;
    if (data.noOfDispatch !== undefined) updateData.noOfDispatch = data.noOfDispatch;
    if (data.assignDispatchTo !== undefined) {
      if (data.assignDispatchTo) {
        updateData.assignedUser = { connect: { userId: data.assignDispatchTo } };
      } else {
        updateData.assignedUser = { disconnect: true };
      }
    }
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
        this.prisma.pOItem.deleteMany({ where: { poId } }),
        this.prisma.purchaseOrder.update({
          where: { poId },
          data: {
            ...updateData,
            poItems: {
              create: data.poItems.map((item: POItemRequest) => ({
                categoryId: item.categoryId,
                oemId: item.oemId,
                productId: item.productId,
                quantity: item.quantity,
                spareQuantity: item.spareQuantity,
                totalQuantity: item.totalQuantity,
                pricePerUnit: new Prisma.Decimal(item.pricePerUnit),
                totalPrice: new Prisma.Decimal(item.totalPrice),
                gstPercent: new Prisma.Decimal(item.gstPercent),
                finalPrice: new Prisma.Decimal(item.finalPrice),
                warranty: item.warranty,
              })),
            },
          },
        }),
      ]);
    } else {
      await this.prisma.purchaseOrder.update({
        where: { poId },
        data: updateData,
      });
    }

    // Return updated PO with relations
    return this.findById(poId);
  }

  async delete(poId: string): Promise<boolean> {
    try {
      await this.prisma.purchaseOrder.delete({ where: { poId } });
      return true;
    } catch {
      return false;
    }
  }
}
