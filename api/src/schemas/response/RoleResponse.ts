export interface RoleResponse {
  roleId: string;
  roleName: string;
  description: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoleListResponse {
  items: RoleResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
