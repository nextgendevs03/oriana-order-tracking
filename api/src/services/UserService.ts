import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { UserListResponse, UserResponse } from '../schemas/response/UserResponse';
import { CreateUserRequest, UpdateUserRequest } from '../schemas/request/UserRequest';
import { IUserRepository } from '../repositories/UserRepository';
import { User } from '@prisma/client';
import bcrypt from 'bcryptjs';

export interface IUserService {
  getAllUsers(): Promise<UserListResponse>;
  createUser(data: CreateUserRequest): Promise<UserResponse>;
  getUserById(id: string): Promise<UserResponse | null>;
  updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse>;
  deleteUser(id: string): Promise<{ id: string; deleted: boolean }>;
}

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository
  ) {}
  // hash pwd using bcryptjs
  private async hashPassword(password: string): Promise<string> {
    const hashStrength = 10;
    return await bcrypt.hash(password, hashStrength);
  }

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const plainPassword = data.password;
    const encryptedPassword = await this.hashPassword(plainPassword);
    const userData: CreateUserRequest = {
      username: data.username,
      email: data.email,
      password: encryptedPassword, // ONLY THIS FIELD IS ENCRYPTED
      role: data.role,
      isActive: data.isActive,
      createdBy: data.createdBy,
      updatedBy: data.updatedBy,
    };

    const user: User = await this.userRepository.create(userData);

    return {
      username: user.username,
      email: user.email,
      password: user.password,
      role: 'roleName',
      isActive: user.isActive,
    };
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user: User | null = await this.userRepository.findById(id);

    if (!user) return null;

    return {
      username: user.username,
      email: user.email,
      password: user.password, // Return encrypted password from database
      role: 'roleName',
      isActive: user.isActive,
    };
  }

  async getAllUsers(): Promise<UserListResponse> {
    const users = await this.userRepository.findAll();

    const modifiedUsers = users.map((user: User) => ({
      username: user.username,
      email: user.email,
      password: user.password,
      role: 'roleName',
      isActive: user.isActive,
      name: user.username,
      createdAt: user.createdAt.toISOString(),
    }));

    return { items: modifiedUsers };
  }

  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    // If password is provided, encrypt ONLY the password
    if (data.password) {
      data.password = await this.hashPassword(data.password); //  ONLY password encrypted
    }
    const user: User = await this.userRepository.update(id, data);

    return {
      username: user.username,
      email: user.email,
      password: user.password, // Return encrypted password from database
      role: 'roleName',
      isActive: user.isActive,
    };
  }

  async deleteUser(id: string): Promise<{ id: string; deleted: boolean }> {
    await this.userRepository.delete(id);
    return {
      id,
      deleted: true,
    };
  }
}
