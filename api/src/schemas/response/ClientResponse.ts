export interface ClientResponse {
  clientId: string;
  clientName: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
}

export interface ClientListResponse {
  data: ClientResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
