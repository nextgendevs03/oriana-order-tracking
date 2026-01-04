/**
 * Commissioning Repository
 *
 * Data access layer for commissioning operations using Prisma ORM.
 */

import { injectable, inject } from 'inversify';
import {
  PrismaClient,
  Commissioning,
  Prisma,
  User,
  PreCommissioning,
  Dispatch,
} from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreateCommissioningRequest,
  UpdateCommissioningRequest,
  ListCommissioningRequest,
} from '../schemas';

// Type for Commissioning with included relations
export type CommissioningWithRelations = Commissioning & {
  preCommissioning: PreCommissioning & {
    dispatch: Dispatch;
  };
  createdBy: User | null;
  updatedBy: User | null;
  warrantyCertificate: { warrantyCertificateId: number } | null;
};

export interface ICommissioningRepository {
  create(
    data: CreateCommissioningRequest,
    createdById?: number
  ): Promise<CommissioningWithRelations[]>;
  findById(commissioningId: number): Promise<CommissioningWithRelations | null>;
  findAll(
    params: ListCommissioningRequest
  ): Promise<{ rows: CommissioningWithRelations[]; count: number }>;
  findByPoId(poId: string): Promise<CommissioningWithRelations[]>;
  findByPreCommissioningId(preCommissioningId: number): Promise<CommissioningWithRelations | null>;
  update(
    commissioningId: number,
    data: UpdateCommissioningRequest,
    updatedById?: number
  ): Promise<CommissioningWithRelations | null>;
  delete(commissioningId: number): Promise<boolean>;
  findEligiblePreCommissionings(poId: string): Promise<
    {
      preCommissioningId: number;
      serialNumber: string;
      productName: string;
      dispatchId: number;
      preCommissioningStatus: string;
    }[]
  >;
  countByPoIdAndStatus(poId: string, status: string): Promise<number>;
}

@injectable()
export class CommissioningRepository implements ICommissioningRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  // Include clause for fetching all relations
  private readonly includeRelations = {
    preCommissioning: {
      include: {
        dispatch: true,
      },
    },
    createdBy: true,
    updatedBy: true,
    warrantyCertificate: {
      select: {
        warrantyCertificateId: true,
      },
    },
  };

  /**
   * Create commissioning records for multiple pre-commissioning entries
   */
  async create(
    data: CreateCommissioningRequest,
    createdById?: number
  ): Promise<CommissioningWithRelations[]> {
    const createdRecords: CommissioningWithRelations[] = [];

    // Create each commissioning record in a transaction
    await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        // Verify pre-commissioning status is "Done"
        const preCommissioning = await tx.preCommissioning.findUnique({
          where: { preCommissioningId: item.preCommissioningId },
        });

        if (!preCommissioning || preCommissioning.preCommissioningStatus !== 'Done') {
          throw new Error(`Pre-commissioning ${item.preCommissioningId} is not in "Done" status`);
        }

        // Check if commissioning already exists
        const existingCommissioning = await tx.commissioning.findUnique({
          where: { preCommissioningId: item.preCommissioningId },
        });

        if (existingCommissioning) {
          throw new Error(
            `Commissioning already exists for pre-commissioning ${item.preCommissioningId}`
          );
        }

        const record = await tx.commissioning.create({
          data: {
            preCommissioningId: item.preCommissioningId,
            ecdFromClient: data.ecdFromClient,
            serviceTicketNo: data.serviceTicketNo,
            ccdFromClient: data.ccdFromClient,
            issues: data.issues,
            solution: data.solution,
            infoGenerated: data.infoGenerated,
            commissioningDate: data.commissioningDate ? new Date(data.commissioningDate) : null,
            commissioningStatus: data.commissioningStatus,
            remarks: data.remarks,
            createdById,
            updatedById: createdById,
          },
          include: this.includeRelations,
        });
        createdRecords.push(record as CommissioningWithRelations);
      }
    });

    return createdRecords;
  }

  /**
   * Find a commissioning record by ID
   */
  async findById(commissioningId: number): Promise<CommissioningWithRelations | null> {
    const record = await this.prisma.commissioning.findUnique({
      where: { commissioningId },
      include: this.includeRelations,
    });
    return record as CommissioningWithRelations | null;
  }

  /**
   * Find all commissioning records with pagination and filtering
   */
  async findAll(
    params: ListCommissioningRequest
  ): Promise<{ rows: CommissioningWithRelations[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      preCommissioningId,
      poId,
      commissioningStatus,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CommissioningWhereInput = {};
    if (preCommissioningId) {
      where.preCommissioningId = preCommissioningId;
    }
    if (poId) {
      where.preCommissioning = { dispatch: { poId } };
    }
    if (commissioningStatus) {
      where.commissioningStatus = commissioningStatus;
    }

    // Build orderBy
    const orderByField = sortBy as keyof Prisma.CommissioningOrderByWithRelationInput;
    const orderBy: Prisma.CommissioningOrderByWithRelationInput = {
      [orderByField]: sortOrder.toLowerCase() as Prisma.SortOrder,
    };

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.commissioning.findMany({
        where,
        include: this.includeRelations,
        orderBy,
        take: limit,
        skip,
      }),
      this.prisma.commissioning.count({ where }),
    ]);

    return { rows: rows as CommissioningWithRelations[], count };
  }

  /**
   * Find all commissioning records for a specific PO
   */
  async findByPoId(poId: string): Promise<CommissioningWithRelations[]> {
    const records = await this.prisma.commissioning.findMany({
      where: { preCommissioning: { dispatch: { poId } } },
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
    return records as CommissioningWithRelations[];
  }

  /**
   * Find commissioning by pre-commissioning ID
   */
  async findByPreCommissioningId(
    preCommissioningId: number
  ): Promise<CommissioningWithRelations | null> {
    const record = await this.prisma.commissioning.findUnique({
      where: { preCommissioningId },
      include: this.includeRelations,
    });
    return record as CommissioningWithRelations | null;
  }

  /**
   * Update a commissioning record
   */
  async update(
    commissioningId: number,
    data: UpdateCommissioningRequest,
    updatedById?: number
  ): Promise<CommissioningWithRelations | null> {
    // Check if record exists
    const existing = await this.prisma.commissioning.findUnique({
      where: { commissioningId },
    });
    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Prisma.CommissioningUncheckedUpdateInput = {};
    if (updatedById !== undefined) updateData.updatedById = updatedById;
    if (data.ecdFromClient !== undefined) updateData.ecdFromClient = data.ecdFromClient;
    if (data.serviceTicketNo !== undefined) updateData.serviceTicketNo = data.serviceTicketNo;
    if (data.ccdFromClient !== undefined) updateData.ccdFromClient = data.ccdFromClient;
    if (data.issues !== undefined) updateData.issues = data.issues;
    if (data.solution !== undefined) updateData.solution = data.solution;
    if (data.infoGenerated !== undefined) updateData.infoGenerated = data.infoGenerated;
    if (data.commissioningDate !== undefined) {
      updateData.commissioningDate = data.commissioningDate
        ? new Date(data.commissioningDate)
        : null;
    }
    if (data.commissioningStatus !== undefined) {
      updateData.commissioningStatus = data.commissioningStatus;
    }
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    await this.prisma.commissioning.update({
      where: { commissioningId },
      data: updateData,
    });

    return this.findById(commissioningId);
  }

  /**
   * Delete a commissioning record
   */
  async delete(commissioningId: number): Promise<boolean> {
    try {
      await this.prisma.commissioning.delete({ where: { commissioningId } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find pre-commissioning records eligible for commissioning
   * Returns pre-commissionings with preCommissioningStatus = "Done" that don't have commissioning yet
   */
  async findEligiblePreCommissionings(poId: string): Promise<
    {
      preCommissioningId: number;
      serialNumber: string;
      productName: string;
      dispatchId: number;
      preCommissioningStatus: string;
    }[]
  > {
    const records = await this.prisma.preCommissioning.findMany({
      where: {
        dispatch: { poId },
        preCommissioningStatus: 'Done',
        commissioning: null, // No commissioning yet
      },
      select: {
        preCommissioningId: true,
        serialNumber: true,
        productName: true,
        dispatchId: true,
        preCommissioningStatus: true,
      },
    });

    return records;
  }

  /**
   * Count commissioning records by PO ID and status
   */
  async countByPoIdAndStatus(poId: string, status: string): Promise<number> {
    return this.prisma.commissioning.count({
      where: {
        preCommissioning: { dispatch: { poId } },
        commissioningStatus: status,
      },
    });
  }
}
