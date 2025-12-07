export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  createdBy: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  updatedBy: string;
  isActive?: boolean;
}

export interface ListRoleRequest {
  page?: number;
  limit?: number;
  isActive?: boolean;
}
