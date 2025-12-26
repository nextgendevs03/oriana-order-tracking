import { injectable, inject } from 'inversify';
import { PrismaClient, Role, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateRoleRequest, UpdateRoleRequest, ListRoleRequest } from '../schemas';

export interface IRoleRepository {
  create(data: CreateRoleRequest): Promise<Role>;
  findById(id: string): Promise<Role | null>;
  findAll(params: ListRoleRequest): Promise<{ rows: Role[]; count: number }>;
  update(id: string, data: UpdateRoleRequest): Promise<Role | null>;
  delete(id: string): Promise<boolean>;
}

@injectable()
export class RoleRepository implements IRoleRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateRoleRequest): Promise<Role> {
    return this.prisma.role.create({
      data: {
        roleName: data.roleName,
        description: data.description || '',
        createdBy: 'system',
        updatedBy: 'system',
        isActive: data.isActive ?? true,
      },
    });
  }

  async findById(id: string): Promise<Role | null> {
    return this.prisma.role.findUnique({ where: { roleId: id } });
  }

  async findAll(params: ListRoleRequest): Promise<{ rows: Role[]; count: number }> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC', isActive } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {};
    if (isActive !== undefined) where.isActive = isActive;

    const orderBy: Prisma.RoleOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'roleName') {
      orderBy.roleName = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        where,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.role.count({ where }),
    ]);

    return { rows, count };
  }

  async update(id: string, data: UpdateRoleRequest): Promise<Role | null> {
    const existing = await this.prisma.role.findUnique({
      where: { roleId: id },
    });

    if (!existing) return null;

    return this.prisma.role.update({
      where: { roleId: id },
      data: {
        ...(data.roleName && { roleName: data.roleName }),
        ...(data.description && { description: data.description }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedBy: 'system',
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.role.delete({ where: { roleId: id } });
      return true;
    } catch {
      return false;
    }
  }
}
