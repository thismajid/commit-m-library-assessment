import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { User } from '@app/interfaces/user.interface';
import { ServiceResponse } from '@app/interfaces/response.interface';
import { UserRole } from './generated/prisma-client-users';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

  async onModuleInit() {
    await this.createAdminIfNotExists();
  }

  private async createAdminIfNotExists() {
    const adminExists = await this.usersRepository.findAdmin();

    if (!adminExists) {
      await this.usersRepository.create({
        name: 'admin',
        username: 'admin',
        password: await bcrypt.hash('strongAdminPassword', 10),
        role: UserRole.ADMIN,
      });
    }
  }

  async checkUserExists(username: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    return !!user;
  }

  async createUser(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.usersRepository.create({
      name: data.name,
      username: data.username,
      password: hashedPassword,
    });
    return user;
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.usersRepository.findByUsername(username);
  }

  async getProfile(
    id: number,
  ): Promise<{ id: number; username: string; name: string }> {
    const user = await this.usersRepository.findOne(id);
    return user;
  }

  async updateProfile(
    id: number,
    name: string,
  ): Promise<{ id: number; username: string; name: string }> {
    const updatedUser = await this.usersRepository.update(id, { name });
    return updatedUser;
  }
}
