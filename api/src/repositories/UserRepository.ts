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
    const user = await this.prisma.user.create({
      data,
    });

    return user;
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        userId: id,
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
    const updatedUser = await this.prisma.user.update({
      where: { userId: id },
      data,
    });
    return updatedUser;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { userId: id },
    });
  }
}
