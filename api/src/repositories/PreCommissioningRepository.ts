/**
 * Pre-Commissioning Repository
 *
 * Data access layer for pre-commissioning operations using Prisma ORM.
 */

import { injectable, inject } from 'inversify';
import { PrismaClient, PreCommissioning, Prisma, User, Dispatch } from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreatePreCommissioningRequest,
  UpdatePreCommissioningRequest,
  ListPreCommissioningRequest,
} from '../schemas';

// Type for PreCommissioning with included relations
export type PreCommissioningWithRelations = PreCommissioning & {
  dispatch: Dispatch & {
    poId: string;
  };
  createdBy: User | null;
  updatedBy: User | null;
  commissioning: { commissioningId: number } | null;
};

export interface IPreCommissioningRepository {
  create(
    data: CreatePreCommissioningRequest,
    createdById?: number
  ): Promise<PreCommissioningWithRelations[]>;
  findById(preCommissioningId: number): Promise<PreCommissioningWithRelations | null>;
  findAll(
    params: ListPreCommissioningRequest
  ): Promise<{ rows: PreCommissioningWithRelations[]; count: number }>;
  findByPoId(poId: string): Promise<PreCommissioningWithRelations[]>;
  findByDispatchId(dispatchId: number): Promise<PreCommissioningWithRelations[]>;
  update(
    preCommissioningId: number,
    data: UpdatePreCommissioningRequest,
    updatedById?: number
  ): Promise<PreCommissioningWithRelations | null>;
  delete(preCommissioningId: number): Promise<boolean>;
  findEligibleSerials(poId: string): Promise<
    {
      dispatchId: number;
      serialNumber: string;
      productName: string;
      dispatchDate: Date | null;
    }[]
  >;
  countByPoIdAndStatus(poId: string, status: string): Promise<number>;
}

@injectable()
export class PreCommissioningRepository implements IPreCommissioningRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  // Include clause for fetching all relations
  private readonly includeRelations = {
    dispatch: true,
    createdBy: true,
    updatedBy: true,
    commissioning: {
      select: {
        commissioningId: true,
      },
    },
  };

  /**
   * Create pre-commissioning records for multiple serial numbers
   */
  async create(
    data: CreatePreCommissioningRequest,
    createdById?: number
  ): Promise<PreCommissioningWithRelations[]> {
    const createdRecords: PreCommissioningWithRelations[] = [];

    // Create each pre-commissioning record in a transaction
    await this.prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const record = await tx.preCommissioning.create({
          data: {
            dispatchId: item.dispatchId,
            serialNumber: item.serialNumber,
            productName: item.productName,
            pcContact: data.pcContact,
            serviceEngineerAssigned: data.serviceEngineerAssigned,
            ppmChecklist: data.ppmChecklist,
            ppmSheetReceivedFromClient: data.ppmSheetReceivedFromClient,
            ppmChecklistSharedWithOem: data.ppmChecklistSharedWithOem,
            ppmTickedNoFromOem: data.ppmTickedNoFromOem,
            ppmConfirmationStatus: data.ppmConfirmationStatus,
            oemComments: data.oemComments,
            preCommissioningStatus: data.preCommissioningStatus,
            remarks: data.remarks,
            createdById,
            updatedById: createdById,
          },
          include: this.includeRelations,
        });
        createdRecords.push(record as PreCommissioningWithRelations);
      }
    });

    return createdRecords;
  }

  /**
   * Find a pre-commissioning record by ID
   */
  async findById(preCommissioningId: number): Promise<PreCommissioningWithRelations | null> {
    const record = await this.prisma.preCommissioning.findUnique({
      where: { preCommissioningId },
      include: this.includeRelations,
    });
    return record as PreCommissioningWithRelations | null;
  }

  /**
   * Find all pre-commissioning records with pagination and filtering
   */
  async findAll(
    params: ListPreCommissioningRequest
  ): Promise<{ rows: PreCommissioningWithRelations[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      dispatchId,
      poId,
      preCommissioningStatus,
      ppmConfirmationStatus,
    } = params;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.PreCommissioningWhereInput = {};
    if (dispatchId) {
      where.dispatchId = dispatchId;
    }
    if (poId) {
      where.dispatch = { poId };
    }
    if (preCommissioningStatus) {
      where.preCommissioningStatus = preCommissioningStatus;
    }
    if (ppmConfirmationStatus) {
      where.ppmConfirmationStatus = ppmConfirmationStatus;
    }

    // Build orderBy
    const orderByField = sortBy as keyof Prisma.PreCommissioningOrderByWithRelationInput;
    const orderBy: Prisma.PreCommissioningOrderByWithRelationInput = {
      [orderByField]: sortOrder.toLowerCase() as Prisma.SortOrder,
    };

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.preCommissioning.findMany({
        where,
        include: this.includeRelations,
        orderBy,
        take: limit,
        skip,
      }),
      this.prisma.preCommissioning.count({ where }),
    ]);

    return { rows: rows as PreCommissioningWithRelations[], count };
  }

  /**
   * Find all pre-commissioning records for a specific PO
   */
  async findByPoId(poId: string): Promise<PreCommissioningWithRelations[]> {
    const records = await this.prisma.preCommissioning.findMany({
      where: { dispatch: { poId } },
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
    return records as PreCommissioningWithRelations[];
  }

  /**
   * Find all pre-commissioning records for a specific dispatch
   */
  async findByDispatchId(dispatchId: number): Promise<PreCommissioningWithRelations[]> {
    const records = await this.prisma.preCommissioning.findMany({
      where: { dispatchId },
      include: this.includeRelations,
      orderBy: { createdAt: 'desc' },
    });
    return records as PreCommissioningWithRelations[];
  }

  /**
   * Update a pre-commissioning record
   */
  async update(
    preCommissioningId: number,
    data: UpdatePreCommissioningRequest,
    updatedById?: number
  ): Promise<PreCommissioningWithRelations | null> {
    // Check if record exists
    const existing = await this.prisma.preCommissioning.findUnique({
      where: { preCommissioningId },
    });
    if (!existing) {
      return null;
    }

    // Build update data
    const updateData: Prisma.PreCommissioningUncheckedUpdateInput = {};
    if (updatedById !== undefined) updateData.updatedById = updatedById;
    if (data.pcContact !== undefined) updateData.pcContact = data.pcContact;
    if (data.serviceEngineerAssigned !== undefined) {
      updateData.serviceEngineerAssigned = data.serviceEngineerAssigned;
    }
    if (data.ppmChecklist !== undefined) updateData.ppmChecklist = data.ppmChecklist;
    if (data.ppmSheetReceivedFromClient !== undefined) {
      updateData.ppmSheetReceivedFromClient = data.ppmSheetReceivedFromClient;
    }
    if (data.ppmChecklistSharedWithOem !== undefined) {
      updateData.ppmChecklistSharedWithOem = data.ppmChecklistSharedWithOem;
    }
    if (data.ppmTickedNoFromOem !== undefined) {
      updateData.ppmTickedNoFromOem = data.ppmTickedNoFromOem;
    }
    if (data.ppmConfirmationStatus !== undefined) {
      updateData.ppmConfirmationStatus = data.ppmConfirmationStatus;
    }
    if (data.oemComments !== undefined) updateData.oemComments = data.oemComments;
    if (data.preCommissioningStatus !== undefined) {
      updateData.preCommissioningStatus = data.preCommissioningStatus;
    }
    if (data.remarks !== undefined) updateData.remarks = data.remarks;

    await this.prisma.preCommissioning.update({
      where: { preCommissioningId },
      data: updateData,
    });

    return this.findById(preCommissioningId);
  }

  /**
   * Delete a pre-commissioning record
   */
  async delete(preCommissioningId: number): Promise<boolean> {
    try {
      await this.prisma.preCommissioning.delete({ where: { preCommissioningId } });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Find serial numbers eligible for pre-commissioning
   * Returns serials from dispatches with deliveryStatus = "done" that don't have pre-commissioning yet
   */
  async findEligibleSerials(poId: string): Promise<
    {
      dispatchId: number;
      serialNumber: string;
      productName: string;
      dispatchDate: Date | null;
    }[]
  > {
    // Get all dispatches with deliveryStatus = "done" for this PO
    const dispatches = await this.prisma.dispatch.findMany({
      where: {
        poId,
        deliveryStatus: 'done',
      },
      include: {
        dispatchedItems: {
          include: {
            product: true,
          },
        },
      },
    });

    // Get existing pre-commissioning serial numbers
    const existingSerials = await this.prisma.preCommissioning.findMany({
      where: { dispatch: { poId } },
      select: { serialNumber: true, dispatchId: true },
    });

    const existingSet = new Set(existingSerials.map((s) => `${s.dispatchId}-${s.serialNumber}`));

    // Extract eligible serials
    const eligibleSerials: {
      dispatchId: number;
      serialNumber: string;
      productName: string;
      dispatchDate: Date | null;
    }[] = [];

    for (const dispatch of dispatches) {
      for (const item of dispatch.dispatchedItems) {
        if (item.serialNumbers) {
          const serials = item.serialNumbers
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s !== '');
          for (const serial of serials) {
            const key = `${dispatch.dispatchId}-${serial}`;
            if (!existingSet.has(key)) {
              eligibleSerials.push({
                dispatchId: dispatch.dispatchId,
                serialNumber: serial,
                productName: item.product.productName,
                dispatchDate: dispatch.dispatchDate,
              });
            }
          }
        }
      }
    }

    return eligibleSerials;
  }

  /**
   * Count pre-commissioning records by PO ID and status
   */
  async countByPoIdAndStatus(poId: string, status: string): Promise<number> {
    return this.prisma.preCommissioning.count({
      where: {
        dispatch: { poId },
        preCommissioningStatus: status,
      },
    });
  }
}
