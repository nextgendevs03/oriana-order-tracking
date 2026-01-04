/**
 * Warranty Certificate Repository
 *
 * Data access layer for warranty certificate operations using Prisma ORM.
 */

import { injectable, inject } from 'inversify';
import {
  PrismaClient,
  WarrantyCertificate,
  Prisma,
  User,
  Commissioning,
  PreCommissioning,
  Dispatch,
} from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreateWarrantyCertificateRequest,
  UpdateWarrantyCertificateRequest,
  ListWarrantyCertificateRequest,
} from '../schemas';

// Type for WarrantyCertificate with included relations
export type WarrantyCertificateWithRelations = WarrantyCertificate & {
  commissioning: Commissioning & {
    preCommissioning: PreCommissioning & {
      dispatch: Dispatch;
    };
  };
  createdBy: User | null;
  updatedBy: User | null;
};

export interface IWarrantyCertificateRepository {
  create(
    data: CreateWarrantyCertificateRequest,
    createdById?: number
  ): Promise<WarrantyCertificateWithRelations[]>;
  findById(warrantyCertificateId: number): Promise<WarrantyCertificateWithRelations | null>;
  findAll(
    params: ListWarrantyCertificateRequest
  ): Promise<{ rows: WarrantyCertificateWithRelations[]; count: number }>;
  findByPoId(poId: string): Promise<WarrantyCertificateWithRelations[]>;
  findByCommissioningId(commissioningId: number): Promise<WarrantyCertificateWithRelations | null>;
  update(
    warrantyCertificateId: number,
    data: UpdateWarrantyCertificateRequest,
    updatedById?: number
  ): Promise<WarrantyCertificateWithRelations | null>;
  delete(warrantyCertificateId: number): Promise<boolean>;
  findEligibleCommissionings(poId: string): Promise<
    {
      commissioningId: number;
      preCommissioningId: number;
      serialNumber: string;
      productName: string;
      dispatchId: number;
      commissioningStatus: string;
      commissioningDate: Date | null;
    }[]
  >;
  countByPoIdAndStatus(poId: string, status: string): Promise<number>;
}

@injectable()
export class WarrantyCertificateRepository implements IWarrantyCertificateRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  // Include clause for fetching all relations
  private readonly includeRelations = {
    commissioning: {
      include: {
        preCommissioning: {
          include: {
            dispatch: true,
          },
        },
      },
    },
    createdBy: true,
    updatedBy: true,
  };

  /**
   * Create warranty certificate records for multiple commissioning entries
   */
  async create(
    data: CreateWarrantyCertificateRequest,
    createdById?: number
  ): Promise<WarrantyCertificateWithRelations[]> {
    const createdRecords: WarrantyCertificateWithRelations[] = [];

    // Create each warranty certificate record in a transaction
    await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        // Verify commissioning status is "Done"
        const commissioning = await tx.commissioning.findUnique({
          where: { commissioningId: item.commissioningId },
        });

        if (!commissioning || commissioning.commissioningStatus !== 'Done') {
          throw new Error(`Commissioning ${item.commissioningId} is not in "Done" status`);
        }

        // Check if warranty certificate already exists
        const existingWarranty = await tx.warrantyCertificate.findUnique({
          where: { commissioningId: item.commissioningId },
        });

        if (existingWarranty) {
          throw new Error(
            `Warranty certificate already exists for commissioning ${item.commissioningId}`
          );
        }

        const record = await tx.warrantyCertificate.create({
          data: {
            commissioningId: item.commissioningId,
            certificateNo: data.certificateNo,
            issueDate: new Date(data.issueDate),
            warrantyStartDate: new Date(data.warrantyStartDate),
            warrantyEndDate: new Date(data.warrantyEndDate),
            warrantyStatus: data.warrantyStatus,
            createdById,
            updatedById: createdById,
          },
          include: this.includeRelations,
        });
        createdRecords.push(record as WarrantyCertificateWithRelations);
      }
    });

    return createdRecords;
  }

  /**
   * Find a warranty certificate record by ID
   */
  async findById(warrantyCertificateId: number): Promise<WarrantyCertificateWithRelations | null> {
    const record = await this.prisma.warrantyCertificate.findUnique({
      where: { warrantyCertificateId },
      include: this.includeRelations,
    });
    return record as WarrantyCertificateWithRelations | null;
  }

  /**
   * Find all warranty certificate records with pagination and filtering
   */
  async findAll(
    params: ListWarrantyCertificateRequest
  ): Promise<{ rows: WarrantyCertificateWithRelations[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      commissioningId,
      poId,
      warrantyStatus,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.WarrantyCertificateWhereInput = {};
    if (commissioningId) {
      where.commissioningId = commissioningId;
    }
    if (poId) {
      where.commissioning = { preCommissioning: { dispatch: { poId } } };
    }
    if (warrantyStatus) {
      where.warrantyStatus = warrantyStatus;
    }

    // Build orderBy
    const orderByField = sortBy as keyof Prisma.WarrantyCertificateOrderByWithRelationInput;
    const orderBy: Prisma.WarrantyCertificateOrderByWithRelationInput = {
      [orderByField]: sortOrder.toLowerCase() as Prisma.SortOrder,
    };

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.warrantyCertificate.findMany({
        where,
        include: this.includeRelations,
        orderBy,
        take: limit,
        skip,
      }),
      this.prisma.warrantyCertificate.count({ where }),
    ]);

    return { rows: rows as WarrantyCertificateWithRelations[], count };
  }

  /**
   * Find all warranty certificate records for a specific PO
   */
  async findByPoId(poId: string): Promise<WarrantyCertificateWithRelations[]> {
    const records = await this.prisma.warrantyCertificate.findMany({
      where: { commissioning: { preCommissioning: { dispatch: { poId } } } },
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
    return records as WarrantyCertificateWithRelations[];
  }

  /**
   * Find warranty certificate by commissioning ID
   */
  async findByCommissioningId(
    commissioningId: number
  ): Promise<WarrantyCertificateWithRelations | null> {
    const record = await this.prisma.warrantyCertificate.findUnique({
      where: { commissioningId },
      include: this.includeRelations,
    });
    return record as WarrantyCertificateWithRelations | null;
  }

  /**
   * Update a warranty certificate record
   */
  async update(
    warrantyCertificateId: number,
    data: UpdateWarrantyCertificateRequest,
    updatedById?: number
  ): Promise<WarrantyCertificateWithRelations | null> {
    // Check if record exists
    const existing = await this.prisma.warrantyCertificate.findUnique({
      where: { warrantyCertificateId },
    });
    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Prisma.WarrantyCertificateUncheckedUpdateInput = {};
    if (updatedById !== undefined) updateData.updatedById = updatedById;
    if (data.certificateNo !== undefined) updateData.certificateNo = data.certificateNo;
    if (data.issueDate !== undefined) updateData.issueDate = new Date(data.issueDate);
    if (data.warrantyStartDate !== undefined) {
      updateData.warrantyStartDate = new Date(data.warrantyStartDate);
    }
    if (data.warrantyEndDate !== undefined) {
      updateData.warrantyEndDate = new Date(data.warrantyEndDate);
    }
    if (data.warrantyStatus !== undefined) updateData.warrantyStatus = data.warrantyStatus;

    await this.prisma.warrantyCertificate.update({
      where: { warrantyCertificateId },
      data: updateData,
    });

    return this.findById(warrantyCertificateId);
  }

  /**
   * Delete a warranty certificate record
   */
  async delete(warrantyCertificateId: number): Promise<boolean> {
    try {
      await this.prisma.warrantyCertificate.delete({ where: { warrantyCertificateId } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find commissioning records eligible for warranty certificate
   * Returns commissionings with commissioningStatus = "Done" that don't have warranty certificate yet
   */
  async findEligibleCommissionings(poId: string): Promise<
    {
      commissioningId: number;
      preCommissioningId: number;
      serialNumber: string;
      productName: string;
      dispatchId: number;
      commissioningStatus: string;
      commissioningDate: Date | null;
    }[]
  > {
    const records = await this.prisma.commissioning.findMany({
      where: {
        preCommissioning: { dispatch: { poId } },
        commissioningStatus: 'Done',
        warrantyCertificate: null, // No warranty certificate yet
      },
      include: {
        preCommissioning: true,
      },
    });

    return records.map((c) => ({
      commissioningId: c.commissioningId,
      preCommissioningId: c.preCommissioningId,
      serialNumber: c.preCommissioning.serialNumber,
      productName: c.preCommissioning.productName,
      dispatchId: c.preCommissioning.dispatchId,
      commissioningStatus: c.commissioningStatus,
      commissioningDate: c.commissioningDate,
    }));
  }

  /**
   * Count warranty certificate records by PO ID and status
   */
  async countByPoIdAndStatus(poId: string, status: string): Promise<number> {
    return this.prisma.warrantyCertificate.count({
      where: {
        commissioning: { preCommissioning: { dispatch: { poId } } },
        warrantyStatus: status,
      },
    });
  }
}
