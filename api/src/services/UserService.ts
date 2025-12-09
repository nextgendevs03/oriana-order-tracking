import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { UserListResponse, UserResponse } from '../schemas/response/UserResponse';
import { CreateUserRequest, UpdateUserRequest } from '../schemas/request/UserRequest';
import { IUserRepository } from '../repositories/UserRepository';

export interface IUserService {
  getAllUsers(): Promise<UserListResponse>;
  createUser(data: CreateUserRequest): Promise<UserResponse>;
  getUserById(id: string): Promise<UserResponse | null>;
  updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse>;
  deleteUser(id: string): Promise<{ id: string; deleted: boolean }>;
}

@injectable()
export class UserService implements IUserService {
  mapToResponse: any;
  constructor(@inject(TYPES.UserRepository) private userRepository: IUserRepository) {}

  async createUser(data: CreateUserRequest): Promise<UserResponse> {
    const user: any = await this.userRepository.create(data);

    // Get the first active role name, or empty string if no roles
    const roleName = user.userRoles?.[0]?.role?.roleName || '';

    const response: UserResponse = {
      username: user.username,
      email: user.email,
      password: user.password,
      role: roleName,
      isActive: user.isActive,
    };

    return response;
  }

  async getUserById(id: string): Promise<UserResponse | null> {
    const user: any = await this.userRepository.findById(id);

    if (!user) {
      return null;
    }

    // Get the first active role name, or empty string if no roles
    const roleName = user.userRoles?.[0]?.role?.roleName || '';

    return {
      username: user.username,
      email: user.email,
      password: user.password,
      role: roleName,
      isActive: user.isActive,
    };
  }

  async getAllUsers(): Promise<UserListResponse> {
    const users = await this.userRepository.findAll();
    const modifiedUsers = users.map((user: any) => {
      // Get the first active role name, or empty string if no roles
      const roleName = user.userRoles?.[0]?.role?.roleName || '';

      return {
        username: user.username,
        email: user.email,
        password: user.password,
        role: roleName,
        isActive: user.isActive,
        name: user.username,
        createdAt: user.createdAt.toISOString(),
      };
    });
    return {
      items: modifiedUsers,
    };
  }
  async updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
    const user: any = await this.userRepository.update(id, data);

    // Get the first active role name, or empty string if no roles
    const roleName = user.userRoles?.[0]?.role?.roleName || '';

    return {
      username: user.username,
      email: user.email,
      password: user.password,
      role: roleName,
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
