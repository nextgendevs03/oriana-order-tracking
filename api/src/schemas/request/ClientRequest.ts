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
