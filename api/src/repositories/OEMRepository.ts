import { injectable, inject } from 'inversify';
import { PrismaClient, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateOEMRequest, UpdateOEMRequest, ListOEMRequest } from '../schemas/request/OEMRequest';
import { OEMResponse } from '../schemas/response/OEMResponse';

export interface IOEMRepository {
  findAll(params?: ListOEMRequest): Promise<{ rows: OEMResponse[]; count: number }>;
  findById(id: string): Promise<OEMResponse | null>;
  create(data: CreateOEMRequest): Promise<OEMResponse>;
  update(id: string, data: UpdateOEMRequest): Promise<OEMResponse>;
  delete(id: string): Promise<void>;
}

@injectable()
export class OEMRepository implements IOEMRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(params?: ListOEMRequest): Promise<{ rows: OEMResponse[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      oemName,
      isActive,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.OEMWhereInput = {};

    if (oemName) {
      where.oemName = {
        contains: oemName,
        mode: 'insensitive',
      };
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const orderBy: Prisma.OEMOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'oemName' || sortBy === 'name') {
      orderBy.oemName = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.oEM.findMany({
        where,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.oEM.count({ where }),
    ]);

    return {
      rows: rows.map((oem) => ({
        oemId: oem.oemId,
        name: oem.oemName,
        isActive: oem.isActive,
        createdAt: oem.createdAt,
        updatedAt: oem.updatedAt,
        createdBy: oem.createdBy,
        updatedBy: oem.updatedBy,
      })),
      count,
    };
  }

  async findById(id: string): Promise<OEMResponse | null> {
    const oem = await this.prisma.oEM.findUnique({ where: { oemId: id } });
    if (!oem) return null;
    return {
      oemId: oem.oemId,
      name: oem.oemName,
      isActive: oem.isActive ?? true,
      createdBy: oem.createdBy,
      updatedBy: oem.updatedBy,
      createdAt: oem.createdAt,
      updatedAt: oem.updatedAt,
    };
  }

  async create(data: CreateOEMRequest): Promise<OEMResponse> {
    const oem = await this.prisma.oEM.create({
      data: {
        oemName: data.name,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy ?? '',
        updatedBy: data.createdBy ?? '',
      },
    });
    return {
      oemId: oem.oemId,
      name: oem.oemName,
      isActive: oem.isActive ?? true,
      createdBy: oem.createdBy,
      updatedBy: oem.updatedBy,
      createdAt: oem.createdAt,
      updatedAt: oem.updatedAt,
    };
  }

  async update(id: string, data: UpdateOEMRequest): Promise<OEMResponse> {
    const updateData: Prisma.OEMUpdateInput = {};

    if (data.name !== undefined) {
      updateData.oemName = data.name;
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive;
    }

    if (data.updatedBy !== undefined) {
      updateData.updatedBy = data.updatedBy;
    }

    const oem = await this.prisma.oEM.update({
      where: { oemId: id },
      data: updateData,
    });
    return {
      oemId: oem.oemId,
      name: oem.oemName,
      isActive: oem.isActive,
      createdBy: oem.createdBy,
      updatedBy: oem.updatedBy,
      createdAt: oem.createdAt,
      updatedAt: oem.updatedAt,
    };
  }

  async delete(id: string): Promise<void> {
    await this.prisma.oEM.delete({ where: { oemId: id } });
  }
}
