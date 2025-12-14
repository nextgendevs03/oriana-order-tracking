import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IClientRepository } from '../repositories/ClientRepository';
import { CreateClientRequest, UpdateClientRequest } from '../schemas/request/ClientRequest';
import { ClientResponse } from '../schemas/response/ClientResponse';

export interface IClientService {
  createClient(data: CreateClientRequest): Promise<ClientResponse>;
  getAllClients(filters?: { isActive?: boolean; clientName?: string }): Promise<ClientResponse[]>;
  getClientById(id: string): Promise<ClientResponse | null>;
  updateClient(id: string, data: UpdateClientRequest): Promise<ClientResponse>;
  deleteClient(id: string): Promise<void>;
}

@injectable()
export class ClientService implements IClientService {
  constructor(
    @inject(TYPES.ClientRepository)
    private clientRepository: IClientRepository
  ) {}

  async createClient(data: CreateClientRequest): Promise<ClientResponse> {
    const created = await this.clientRepository.create(data);
    return created;
  }

  async getAllClients(filters?: {
    isActive?: boolean;
    clientName?: string;
  }): Promise<ClientResponse[]> {
    return this.clientRepository.findAll(filters);
  }

  async getClientById(id: string): Promise<ClientResponse | null> {
    const client = await this.clientRepository.findById(id);
    return client;
  }

  async updateClient(id: string, data: UpdateClientRequest): Promise<ClientResponse> {
    const updatedClient = await this.clientRepository.update(id, data);
    return updatedClient;
  }

  async deleteClient(id: string) {
    await this.clientRepository.delete(id);
  }
}
