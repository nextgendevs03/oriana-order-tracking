export interface CreateOEMRequest {
  name: string;
  isActive: boolean;
  createdBy?: string;
}

export interface UpdateOEMRequest {
  name?: string;
  isActive?: boolean;
  updatedBy?: string;
}

export interface ListOEMRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  oemName?: string;
  isActive?: boolean;
}
