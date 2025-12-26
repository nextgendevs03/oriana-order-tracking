import { injectable, inject } from 'inversify';
import { PrismaClient, Client, Prisma } from '@prisma/client';
import { TYPES } from '../types/types';
import {
  CreateClientRequest,
  UpdateClientRequest,
  ListClientRequest,
} from '../schemas/request/ClientRequest';
import { ClientResponse } from 'src/schemas/response/ClientResponse';

export interface IClientRepository {
  findAll(params?: ListClientRequest): Promise<{ rows: ClientResponse[]; count: number }>;
  findById(id: string): Promise<Client | null>;
  create(data: CreateClientRequest): Promise<Client>;
  update(id: string, data: UpdateClientRequest): Promise<Client>;
  delete(id: string): Promise<void>;
}

@injectable()
export class ClientRepository implements IClientRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findAll(params?: ListClientRequest): Promise<{ rows: ClientResponse[]; count: number }> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      clientName,
      isActive,
    } = params || {};
    const skip = (page - 1) * limit;

    const where: Prisma.ClientWhereInput = {};

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (clientName) {
      where.clientName = {
        contains: clientName,
        mode: 'insensitive',
      };
    }

    const orderBy: Prisma.ClientOrderByWithRelationInput = {};
    if (sortBy === 'createdAt') {
      orderBy.createdAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'clientName') {
      orderBy.clientName = sortOrder === 'ASC' ? 'asc' : 'desc';
    } else if (sortBy === 'updatedAt') {
      orderBy.updatedAt = sortOrder === 'ASC' ? 'asc' : 'desc';
    }

    const [rows, count] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        take: limit,
        skip,
        orderBy,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      rows: rows.map((client) => ({
        clientId: client.clientId,
        clientName: client.clientName,
        isActive: client.isActive,
        createdBy: client.createdBy,
        updatedBy: client.updatedBy,
      })),
      count,
    };
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
