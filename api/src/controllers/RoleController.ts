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
    const result = await this.service.createRole(data);
    return createSuccessResponse(result, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: string,
    @Query('isActive') isActive?: string,
    @Query('searchKey') searchKey?: string,
    @Query('searchTerm') searchTerm?: string
  ) {
    const result = await this.service.getAllRoles({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20,
      sortBy: sortBy || 'createdAt',
      sortOrder: (sortOrder as 'ASC' | 'DESC') || 'DESC',
      isActive: isActive ? isActive === 'true' : undefined,
      searchKey: searchKey || undefined,
      searchTerm: searchTerm || undefined,
    });
    const { data, pagination } = result;
    return createSuccessResponse({ data, pagination }, 200);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string) {
    const roleId = parseInt(id, 10);
    if (isNaN(roleId)) throw new ValidationError('Invalid role ID');
    const role = await this.service.getRoleById(roleId);
    if (!role) throw new NotFoundError(`Role ${id} not found`);
    return createSuccessResponse(role, 200);
  }

  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdateRoleRequest) {
    const roleId = parseInt(id, 10);
    if (isNaN(roleId)) throw new ValidationError('Invalid role ID');
    const role = await this.service.updateRole(roleId, data);
    if (!role) throw new NotFoundError(`Role ${id} not found`);
    return createSuccessResponse(role);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string) {
    const roleId = parseInt(id, 10);
    if (isNaN(roleId)) throw new ValidationError('Invalid role ID');
    const deleted = await this.service.deleteRole(roleId);
    if (!deleted) throw new NotFoundError(`Role ${id} not found`);

    return createSuccessResponse({ id: roleId, deleted: true });
  }
}
