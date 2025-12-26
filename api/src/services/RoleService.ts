import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IRoleRepository } from '../repositories/RoleRepository';
import {
  CreateRoleRequest,
  UpdateRoleRequest,
  ListRoleRequest,
  RoleResponse,
  RoleListResponse,
} from '../schemas';

export interface IRoleService {
  createRole(data: CreateRoleRequest): Promise<RoleResponse>;
  getRoleById(id: string): Promise<RoleResponse | null>;
  getAllRoles(params: ListRoleRequest): Promise<RoleListResponse>;
  updateRole(id: string, data: UpdateRoleRequest): Promise<RoleResponse | null>;
  deleteRole(id: string): Promise<boolean>;
}

@injectable()
export class RoleService implements IRoleService {
  constructor(@inject(TYPES.RoleRepository) private repo: IRoleRepository) {}

  async createRole(data: CreateRoleRequest): Promise<RoleResponse> {
    const role = await this.repo.create(data);
    return role;
  }

  async getRoleById(id: string): Promise<RoleResponse | null> {
    const role = await this.repo.findById(id);
    return role;
  }

  async getAllRoles(params: ListRoleRequest): Promise<RoleListResponse> {
    const { page = 1, limit = 20 } = params;
    const { rows, count } = await this.repo.findAll(params);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateRole(id: string, data: UpdateRoleRequest): Promise<RoleResponse | null> {
    const role = await this.repo.update(id, data);
    return role;
  }

  async deleteRole(id: string): Promise<boolean> {
    return this.repo.delete(id);
  }
}
