import { injectable, inject } from 'inversify';
import { PrismaClient, Permission, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreatePermissionRequest,
  UpdatePermissionRequest,
  ListPermissionRequest,
} from '../schemas';

export interface IPermissionRepository {
  create(data: CreatePermissionRequest): Promise<Permission>;
  findById(id: string): Promise<Permission | null>;
  findAll(params: ListPermissionRequest): Promise<{ rows: Permission[]; count: number }>;
  update(id: string, data: UpdatePermissionRequest): Promise<Permission | null>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class PermissionRepository implements IPermissionRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreatePermissionRequest): Promise<Permission> {
    return this.prisma.permission.create({
      data: {
        permissionName: data.permissionName,
        description: data.description ?? '',
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
        isActive: data.isActive ?? true,
      },
    });
  }

  async findById(id: string): Promise<Permission | null> {
    return this.prisma.permission.findUnique({ where: { permissionId: id } });
  }

  async findAll(params: ListPermissionRequest): Promise<{ rows: Permission[]; count: number }> {
    const { page = 1, limit = 10, isActive } = params;
    const skip = (page - 1) * limit;
    const where: Prisma.PermissionWhereInput = {};
    if (isActive !== undefined) where.isActive = isActive;

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.permission.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.permission.count({ where }),
    ]);
    return { rows, count };
  }

  async update(id: string, data: UpdatePermissionRequest): Promise<Permission | null> {
    const existing = await this.prisma.permission.findUnique({ where: { permissionId: id } });
    if (!existing) return null;
    return this.prisma.permission.update({
      where: { permissionId: id },
      data: {
        ...(data.permissionName && { permissionName: data.permissionName }),
        ...(data.description && { description: data.description }),
        updatedBy: data.updatedBy,
        ...(data.isActive !== undefined && { isActive: data.isActive }),
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.permission.delete({ where: { permissionId: id } });
      return true;
    } catch {
      return false;
    }
  }
}
