import { injectable, inject } from 'inversify';
import { PrismaClient, Client, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import { CreateClientRequest, UpdateClientRequest } from '../schemas/request/ClientRequest';
import { ClientResponse } from 'src/schemas/response/ClientResponse';

export interface IClientRepository {
  findAll(filters?: { isActive?: boolean; clientName?: string }): Promise<ClientResponse[]>;
  findById(id: string): Promise<Client | null>;
  create(data: CreateClientRequest): Promise<Client>;
  update(id: string, data: UpdateClientRequest): Promise<Client>;
  delete(id: string): Promise<void>;
}

@injectable()
export class ClientRepository implements IClientRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(filters?: { isActive?: boolean; clientName?: string }): Promise<ClientResponse[]> {
    const where: Prisma.ClientWhereInput = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.clientName) {
      where.clientName = {
        contains: filters.clientName,
        mode: 'insensitive',
      };
    }

    const clients = await this.prisma.client.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return clients.map((client) => ({
      clientId: client.clientId,
      clientName: client.clientName,
      isActive: client.isActive,
      createdBy: client.createdBy,
      updatedBy: client.updatedBy,
    }));
  }

  async findById(id: string): Promise<Client | null> {
    return this.prisma.client.findUnique({ where: { clientId: id } });
  }

  async create(data: CreateClientRequest): Promise<Client> {
    return this.prisma.client.create({
      data: {
        clientName: data.clientName,
        isActive: data.isActive ?? true,
        createdBy: data.createdBy ?? '',
        updatedBy: data.createdBy ?? '',
      },
    });
  }

  async update(id: string, data: UpdateClientRequest): Promise<Client> {
    return this.prisma.client.update({
      where: { clientId: id },
      data: {
        clientName: data.clientName,
        isActive: data.isActive ?? true,
        updatedBy: data.updatedBy ?? undefined,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.client.delete({ where: { clientId: id } });
  }
}
