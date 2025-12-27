import { injectable, inject } from 'inversify';
import { PrismaClient, Role, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateRoleRequest, UpdateRoleRequest, ListRoleRequest } from '../schemas';

// Allowed searchable fields for Role model
const ALLOWED_SEARCH_FIELDS = ['roleName'] as const;
type AllowedSearchField = (typeof ALLOWED_SEARCH_FIELDS)[number];

// Default search field when searchKey is not provided
const DEFAULT_SEARCH_FIELD: AllowedSearchField = 'roleName';

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

  /**
   * Validate if the search field is allowed
   */
  private isValidSearchField(field: string): field is AllowedSearchField {
    return ALLOWED_SEARCH_FIELDS.includes(field as AllowedSearchField);
  }

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
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      isActive,
      searchKey,
      searchTerm,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.RoleWhereInput = {};
    if (isActive !== undefined) where.isActive = isActive;

    // Dynamic search implementation with default field
    if (searchTerm) {
      // If searchKey is provided, use it; otherwise use default
      const fieldToSearch = searchKey || DEFAULT_SEARCH_FIELD;

      // Security: Validate searchKey is in allowed list
      if (!this.isValidSearchField(fieldToSearch)) {
        throw new Error(
          `Invalid search field: ${fieldToSearch}. Allowed fields: ${ALLOWED_SEARCH_FIELDS.join(', ')}`
        );
      }

      // Build dynamic search condition (case-insensitive)
      where[fieldToSearch] = {
        contains: searchTerm,
        mode: 'insensitive',
      };
    }

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
