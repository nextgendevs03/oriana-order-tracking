import 'reflect-metadata';
import { injectable, inject } from 'inversify';
import { APIGatewayProxyResult } from 'aws-lambda';
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  createSuccessResponse,
  NotFoundError,
  ValidationError,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IPermissionService } from '../services/PermissionService';
import { CreatePermissionRequest, UpdatePermissionRequest } from '../schemas';

@Controller({ path: '/api/permission', lambdaName: 'permission' })
@injectable()
export class PermissionController {
  constructor(@inject(TYPES.PermissionService) private permissionService: IPermissionService) {}

  @Post('/')
  async create(@Body() data: CreatePermissionRequest) {
    if (!data.permissionName)
      throw new ValidationError('permissionName and createdBy are required');
    const permission = await this.permissionService.createPermission(data);
    return createSuccessResponse(permission, 201);
  }

  @Get('/')
  async getAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('isActive') isActive?: string,
    @Query('searchKey') searchKey?: string,
    @Query('searchTerm') searchTerm?: string
  ): Promise<APIGatewayProxyResult> {
    const result = await this.permissionService.getAllPermissions({
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 10,
      isActive: isActive ? isActive === 'true' : undefined,
      searchKey: searchKey || undefined,
      searchTerm: searchTerm || undefined,
    });
    return createSuccessResponse(result.data, 200, result.pagination);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string) {
    const permission = await this.permissionService.getPermissionById(id);
    if (!permission) throw new NotFoundError(`Permission with ID ${id} not found`);
    return createSuccessResponse(permission);
  }

  @Put('/{id}')
  async update(@Param('id') id: string, @Body() data: UpdatePermissionRequest) {
    const permission = await this.permissionService.updatePermission(id, data);
    if (!permission) throw new NotFoundError(`Permission with ID ${id} not found`);
    return createSuccessResponse(permission);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string) {
    const deleted = await this.permissionService.deletePermission(id);
    if (!deleted) throw new NotFoundError(`Permission with ID ${id} not found`);
    return createSuccessResponse({ permissionId: id, deleted: true });
  }
}
