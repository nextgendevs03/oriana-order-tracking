export interface CreateRoleRequest {
  roleName: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateRoleRequest {
  roleName?: string;
  description?: string;
  isActive?: boolean;
}

export interface ListRoleRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  isActive?: boolean;
}
