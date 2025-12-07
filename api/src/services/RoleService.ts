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
    return this.map(role);
  }

  async getRoleById(id: string) {
    const role = await this.repo.findById(id);
    return role ? this.map(role) : null;
  }

  async getAllRoles(params: ListRoleRequest): Promise<RoleListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.repo.findAll(params);

    return {
      items: rows.map((r) => this.map(r)),
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async updateRole(id: string, data: UpdateRoleRequest) {
    const role = await this.repo.update(id, data);
    return role ? this.map(role) : null;
  }

  async deleteRole(id: string) {
    return this.repo.delete(id);
  }

  private map(role: any): RoleResponse {
    return {
      roleId: role.roleId,
      roleName: role.roleName,
      description: role.description,
      isActive: role.isActive,
      createdBy: role.createdBy,
      updatedBy: role.updatedBy,
      createdAt: role.createdAt.toISOString(),
      updatedAt: role.updatedAt.toISOString(),
    };
  }
}
