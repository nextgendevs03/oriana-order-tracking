export interface ClientResponse {
  clientId: string;
  clientName: string;
  clientAddress?: string | null;
  clientContact?: string | null;
  clientGST?: string | null;
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
