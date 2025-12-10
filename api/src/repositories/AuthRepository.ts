import { injectable, inject } from 'inversify';
import { TYPES } from '../types/types';
import { PrismaClient, User } from '@prisma/client';

export interface IAuthRepository {
  findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null>;
  validatePassword(user: User, password: string): Promise<boolean>;
}

@injectable()
export class AuthRepository implements IAuthRepository {
  constructor(@inject(TYPES.PrismaClient) private prisma: PrismaClient) {}

  async findByUsernameOrEmail(usernameOrEmail: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
        isActive: true,
      },
    });

    return user;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.password === password;
  }
}
