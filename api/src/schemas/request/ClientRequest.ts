export interface CreateClientRequest {
  clientName: string;
  isActive: boolean;
  createdBy: string;
}

export interface UpdateClientRequest {
  clientName?: string;
  isActive?: boolean;
  updatedBy: string;
}

export interface ListClientRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  clientName?: string;
  isActive?: boolean;
}
