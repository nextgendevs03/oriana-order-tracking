import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { PrismaClient, User, Prisma } from '@prisma/client';
import {
  CreateUserRequest,
  UpdateUserRequest,
  ListUserRequest,
} from '../schemas/request/UserRequest';
export interface IUserRepository {
  findAll(params?: ListUserRequest): Promise<{ rows: User[]; count: number }>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserRequest): Promise<User>;
  delete(id: string): Promise<void>;
  create(data: CreateUserRequest): Promise<User>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateUserRequest): Promise<User> {
    const { role, roleId, ...userData } = data;
    let finalRoleId: string | undefined = roleId;

    // If roleId is not provided but role name is, find the role by name
    if (!finalRoleId && role) {
      const roleRecord = await this.prisma.role.findFirst({
        where: {
          roleName: role,
          isActive: true,
        },
      });

      if (roleRecord) {
        finalRoleId = roleRecord.roleId;
      }
    }

    // Create user with roleId
    const user = await this.prisma.user.create({
      data: {
        ...userData,
        roleId: finalRoleId,
      } as any,
      include: {
        role: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      } as any,
    });

    // If role is provided and roleId wasn't set, create UserRole relationship for backward compatibility
    if (role && !finalRoleId) {
      const roleRecord = await this.prisma.role.findFirst({
        where: {
          roleName: role,
          isActive: true,
        },
      });

      if (roleRecord) {
        await this.prisma.userRole.create({
          data: {
            userId: user.userId,
            roleId: roleRecord.roleId,
            createdBy: data.createdBy,
            updatedBy: data.updatedBy,
            isActive: true,
          },
        });
      }
    }

    // Fetch user again with all relations
    return this.prisma.user.findUnique({
      where: { userId: user.userId },
      include: {
        role: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      } as any,
    }) as Promise<User>;
  }

  async findAll(params?: ListUserRequest): Promise<{ rows: User[]; count: number }> {
    const { page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'DESC' } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {};

    const orderBy: Prisma.UserOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'username') {
      orderBy.username = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'email') {
      orderBy.email = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        take: limit,
        skip,
        orderBy,
        include: {
          role: true,
          userRoles: {
            include: {
              role: true,
            },
          },
        } as any,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { rows, count };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
      include: {
        role: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      } as any,
    });
    return user;
  }

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
    if (!user) {
      throw new Error('User not found');
    }

    const { role, roleId, ...updateFields } = data;
    const userUpdateData: Record<string, any> = {};
    if (updateFields.email !== undefined) userUpdateData.email = updateFields.email;
    if (updateFields.password !== undefined) userUpdateData.password = updateFields.password;
    if (updateFields.isActive !== undefined) userUpdateData.isActive = updateFields.isActive;
    if (updateFields.updatedBy !== undefined) userUpdateData.updatedBy = updateFields.updatedBy;

    // Handle roleId: if roleId is provided, use it directly; if role name is provided, find the roleId
    let finalRoleId: string | undefined | null = roleId;
    if (finalRoleId === undefined && role !== undefined) {
      const roleRecord = await this.prisma.role.findFirst({
        where: {
          roleName: role,
          isActive: true,
        },
      });

      if (roleRecord) {
        finalRoleId = roleRecord.roleId;
      }
    }

    // Update roleId if provided
    if (finalRoleId !== undefined) {
      userUpdateData.roleId = finalRoleId;
    }

    // Actually update the user record in database
    if (Object.keys(userUpdateData).length > 0) {
      await this.prisma.user.update({
        where: { userId: id },
        data: userUpdateData,
      });
    }

    // If role is provided (for backward compatibility with UserRole table), update the UserRole relationship
    if (role !== undefined && !roleId) {
      // Find the role
      const roleRecord = await this.prisma.role.findFirst({
        where: {
          roleName: role,
          isActive: true,
        },
      });

      if (roleRecord) {
        // Delete existing active user roles
        await this.prisma.userRole.updateMany({
          where: {
            userId: id,
            isActive: true,
          },
          data: {
            isActive: false,
            updatedBy: data.updatedBy || user.updatedBy,
          },
        });

        // Check if this role is already assigned (even if inactive)
        const existingUserRole = await this.prisma.userRole.findFirst({
          where: {
            userId: id,
            roleId: roleRecord.roleId,
          },
        });

        if (existingUserRole) {
          // Reactivate and update
          await this.prisma.userRole.update({
            where: { userRoleId: existingUserRole.userRoleId },
            data: {
              isActive: true,
              updatedBy: data.updatedBy || user.updatedBy,
            },
          });
        } else {
          // Create new UserRole
          await this.prisma.userRole.create({
            data: {
              userId: id,
              roleId: roleRecord.roleId,
              createdBy: data.updatedBy || user.updatedBy,
              updatedBy: data.updatedBy || user.updatedBy,
              isActive: true,
            },
          });
        }
      }
    }

    // Fetch user again with all relations
    return this.prisma.user.findUnique({
      where: { userId: id },
      include: {
        role: true,
        userRoles: {
          include: {
            role: true,
          },
        },
      } as any,
    }) as Promise<User>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { userId: id },
    });
  }
}
