import { injectable, inject } from 'inversify';
import { PrismaClient, OEM } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateOEMRequest, UpdateOEMRequest } from '../schemas/request/OEMRequest';
import { OEMResponse } from '../schemas/response/OEMResponse';

export interface IOEMRepository {
  findAll(): Promise<OEMResponse[]>;
  findById(id: string): Promise<OEMResponse | null>;
  create(data: CreateOEMRequest): Promise<OEMResponse>;
  update(id: string, data: UpdateOEMRequest): Promise<OEMResponse>;
  delete(id: string): Promise<void>;
}

@injectable()
export class OEMRepository implements IOEMRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(): Promise<OEM[]> {
    return this.prisma.OEM.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<OEM | null> {
    return this.prisma.OEM.findUnique({ where: { oemId: id } });
  }

  async create(data: CreateOEMRequest): Promise<OEM> {
    return this.prisma.OEM.create({
      data: {
        name: data.name,
        status: data.status,
        createdBy: data.createdBy || null,
      },
    });
  }

  async update(id: string, data: UpdateOEMRequest): Promise<OEM> {
    return this.prisma.OEM.update({
      where: { oemId: id },
      data: {
        name: data.name,
        status: data.status,
        updatedBy: data.updatedBy || null,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.OEM.delete({ where: { oemId: id } });
  }
}
