import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { PrismaClient, User } from '@prisma/client';
import { CreateUserRequest, UpdateUserRequest } from '../schemas/request/UserRequest';
export interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: UpdateUserRequest): Promise<User>;
  delete(id: string): Promise<void>;
  create(data: CreateUserRequest): Promise<User>;
}

@injectable()
export class UserRepository implements IUserRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async create(data: CreateUserRequest): Promise<User> {
    const { role, ...userData } = data;
    const user = await this.prisma.user.create({
      data: userData,
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });

    // If role is provided, find the role and create UserRole relationship
    if (role) {
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

    // Fetch user again with roles included
    return this.prisma.user.findUnique({
      where: { userId: user.userId },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    }) as Promise<User>;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    });
    return users;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
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

    const { role, ...updateFields } = data;
    const userUpdateData: any = {};
    if (updateFields.email !== undefined) userUpdateData.email = updateFields.email;
    if (updateFields.password !== undefined) userUpdateData.password = updateFields.password;
    if (updateFields.isActive !== undefined) userUpdateData.isActive = updateFields.isActive;
    if (updateFields.updatedBy !== undefined) userUpdateData.updatedBy = updateFields.updatedBy;

    // Actually update the user record in database
    if (Object.keys(userUpdateData).length > 0) {
      await this.prisma.user.update({
        where: { userId: id },
        data: userUpdateData,
      });
    }

    // If role is provided, update the UserRole relationship
    if (role !== undefined) {
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

    // Fetch user again with roles included
    return this.prisma.user.findUnique({
      where: { userId: id },
      include: {
        userRoles: {
          include: {
            role: true,
          },
        },
      },
    }) as Promise<User>;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { userId: id },
    });
  }
}
