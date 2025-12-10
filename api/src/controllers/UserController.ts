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
  createSuccessResponse,
} from '@oriana/shared';
import { TYPES } from '../types/types';
import { IUserService } from '../services/UserService';
import { CreateUserRequest, UpdateUserRequest } from '../schemas/request/UserRequest';

export interface IUserController {
  create(data: CreateUserRequest): Promise<APIGatewayProxyResult>;
  getAll(): Promise<APIGatewayProxyResult>;
  getById(id: string): Promise<APIGatewayProxyResult>;
  update(id: string, data: UpdateUserRequest): Promise<APIGatewayProxyResult>;
  delete(id: string): Promise<APIGatewayProxyResult>;
}

@Controller({ path: '/api/user', lambdaName: 'user' })
@injectable()
export class UserController implements IUserController {
  constructor(@inject(TYPES.UserService) private userService: IUserService) {}

  @Post('/')
  async create(@Body() data: CreateUserRequest): Promise<APIGatewayProxyResult> {
    const user = await this.userService.createUser(data);
    return createSuccessResponse(user, 201);
  }

  @Get('/')
  async getAll(): Promise<APIGatewayProxyResult> {
    const users = await this.userService.getAllUsers();

    return createSuccessResponse(users);
  }

  @Get('/{id}')
  async getById(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const user = await this.userService.getUserById(id);
    return createSuccessResponse(user);
  }

  @Put('/{id}')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateUserRequest
  ): Promise<APIGatewayProxyResult> {
    const user = await this.userService.updateUser(id, data);
    return createSuccessResponse(user);
  }

  @Delete('/{id}')
  async delete(@Param('id') id: string): Promise<APIGatewayProxyResult> {
    const user = await this.userService.deleteUser(id);
    return createSuccessResponse(user);
  }
}
