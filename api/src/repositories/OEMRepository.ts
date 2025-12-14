import { injectable, inject } from 'inversify';
import { PrismaClient, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateOEMRequest, UpdateOEMRequest } from '../schemas/request/OEMRequest';
import { OEMResponse } from '../schemas/response/OEMResponse';

export interface IOEMRepository {
  findAll(filters?: { oemName?: string; isActive?: boolean }): Promise<OEMResponse[]>;
  findById(id: string): Promise<OEMResponse | null>;
  create(data: CreateOEMRequest): Promise<OEMResponse>;
  update(id: string, data: UpdateOEMRequest): Promise<OEMResponse>;
  delete(id: string): Promise<void>;
}

@injectable()
export class OEMRepository implements IOEMRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(filters?: { oemName?: string; isActive?: boolean }): Promise<OEMResponse[]> {
    const where: Prisma.OEMWhereInput = {};

    if (filters?.oemName) {
      where.oemName = {
        contains: filters.oemName,
        mode: 'insensitive',
      };
    }

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    const oems = await this.prisma.oEM.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return oems.map((oem) => ({
      oemId: oem.oemId,
      name: oem.oemName,
      isActive: oem.isActive,
      createdAt: oem.createdAt,
      updatedAt: oem.updatedAt,
      createdBy: oem.createdBy,
      updatedBy: oem.updatedBy,
    }));
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
        isActive: data.status ?? true,
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
    const oem = await this.prisma.oEM.update({
      where: { oemId: id },
      data: {
        ...(data.name && { oemName: data.name }),
        ...(data.status !== undefined && { isActive: data.status ?? true }),
        ...(data.updatedBy && { updatedBy: data.updatedBy }),
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

  async delete(id: string): Promise<void> {
    await this.prisma.oEM.delete({ where: { oemId: id } });
  }
}
