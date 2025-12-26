import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  createSuccessResponse,
  createErrorResponse,
} from '@oriana/shared';

import { TYPES } from '../types/types';
import { IClientService } from '../services/ClientService';
import { CreateClientRequest, UpdateClientRequest } from '../schemas/request/ClientRequest';

export interface IClientController {
  create(data: CreateClientRequest): Promise<APIGatewayProxyResult>;
  getAll(isActive?: string, clientName?: string): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateClientRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/client', lambdaName: 'productManagement' })
@injectable()
export class ClientController implements IClientController {
  constructor(
    @inject(TYPES.ClientService)
    private clientService: IClientService
  ) {}

  @Post('/')
  async create(@Body() data: CreateClientRequest) {
    try {
      const client = await this.clientService.createClient(data);
      return createSuccessResponse(client, 201);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('isActive') isActive?: string,
    @Query('clientName') clientName?: string
  ) {
    try {
      const result = await this.clientService.getAllClients({
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 20,
        sortBy: sortBy || 'createdAt',
        sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
        isActive: isActive ? isActive === 'true' : undefined,
        clientName: clientName || undefined,
      });
      return createSuccessResponse(result.data, 200, result.pagination);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Get('/{id}')
  async getById(@Param('id') id: string) {
    try {
      const client = await this.clientService.getClientById(id);
      return createSuccessResponse(client);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdateClientRequest) {
    try {
      const updated = await this.clientService.updateClient(id, data);
      return createSuccessResponse(updated);
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string) {
    try {
      await this.clientService.deleteClient(id);
      return createSuccessResponse({ deleted: true });
    } catch (err: unknown) {
      return createErrorResponse(err as Error);
    }
  }
}
