import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { IClientRepository } from '../repositories/ClientRepository';
import {
  CreateClientRequest,
  UpdateClientRequest,
  ListClientRequest,
} from '../schemas/request/ClientRequest';
import { ClientResponse, ClientListResponse } from '../schemas/response/ClientResponse';

export interface IClientService {
  createClient(data: CreateClientRequest): Promise<ClientResponse>;
  getAllClients(params?: ListClientRequest): Promise<ClientListResponse>;
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

  async getAllClients(params?: ListClientRequest): Promise<ClientListResponse> {
    const { page = 1, limit = 20 } = params || {};
    const { rows, count } = await this.clientRepository.findAll(params);

    return {
      data: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
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
