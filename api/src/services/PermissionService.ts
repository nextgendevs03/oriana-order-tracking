import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IPermissionRepository } from '../repositories/PermissionRepository';
import {
  CreatePermissionRequest,
  UpdatePermissionRequest,
  ListPermissionRequest,
  PermissionResponse,
  PermissionListResponse,
} from '../schemas';

export interface IPermissionService {
  createPermission(data: CreatePermissionRequest): Promise<PermissionResponse>;
  getPermissionById(id: string): Promise<PermissionResponse | null>;
  getAllPermissions(params: ListPermissionRequest): Promise<PermissionListResponse>;
  updatePermission(id: string, data: UpdatePermissionRequest): Promise<PermissionResponse | null>;
  deletePermission(id: string): Promise<boolean>;
}

@injectable()
export class PermissionService implements IPermissionService {
  constructor(@inject(TYPES.PermissionRepository) private repository: IPermissionRepository) {}

  async createPermission(data: CreatePermissionRequest): Promise<PermissionResponse> {
    const permission = await this.repository.create(data);
    return this.mapToResponse(permission);
  }

  async getPermissionById(id: string): Promise<PermissionResponse | null> {
    const permission = await this.repository.findById(id);
    return permission ? this.mapToResponse(permission) : null;
  }

  async getAllPermissions(params: ListPermissionRequest): Promise<PermissionListResponse> {
    const { page = 1, limit = 10 } = params;
    const { rows, count } = await this.repository.findAll(params);
    return {
      items: rows.map(this.mapToResponse),
      pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) },
    };
  }

  async updatePermission(
    id: string,
    data: UpdatePermissionRequest
  ): Promise<PermissionResponse | null> {
    const permission = await this.repository.update(id, data);
    return permission ? this.mapToResponse(permission) : null;
  }

  async deletePermission(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  private mapToResponse(permission: any): PermissionResponse {
    return {
      permissionId: permission.permissionId,
      permissionName: permission.permissionName,
      description: permission.description,
      createdBy: permission.createdBy,
      updatedBy: permission.updatedBy,
      isActive: permission.isActive,
      createdAt: permission.createdAt.toISOString(),
      updatedAt: permission.updatedAt.toISOString(),
    };
  }
}
