import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  createSuccessResponse,
  ValidationError,
  NotFoundError,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IRoleService } from '../services/RoleService';
import { CreateRoleRequest, UpdateRoleRequest } from '../schemas';

@Controller({ path: '/api/role', lambdaName: 'role' })
@injectable()
export class RoleController {
  constructor(@inject(TYPES.RoleService) private service: IRoleService) {}

  @Post('/')
  async create(@Body() data: CreateRoleRequest) {
    if (!data.roleName) throw new ValidationError('roleName is required');
    if (!data.createdBy) throw new ValidationError('createdBy is required');

    const result = await this.service.createRole(data);
    return createSuccessResponse(result, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string
  ) {
    const result = await this.service.getAllRoles({
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10,
      isActive: isActive ? isActive === 'true' : undefined,
    });

    return createSuccessResponse(result.items, 200, result.pagination);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string) {
    const role = await this.service.getRoleById(id);
    if (!role) throw new NotFoundError(`Role ${id} not found`);
    return createSuccessResponse(role);
  }

  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdateRoleRequest) {
    if (!data.updatedBy) throw new ValidationError('updatedBy required');

    const role = await this.service.updateRole(id, data);
    if (!role) throw new NotFoundError(`Role ${id} not found`);
    return createSuccessResponse(role);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string) {
    const deleted = await this.service.deleteRole(id);
    if (!deleted) throw new NotFoundError(`Role ${id} not found`);

    return createSuccessResponse({ id, deleted: true });
  }
}
