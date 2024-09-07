import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { User } from '@app/interfaces/user.interface';
import { ServiceResponse } from '@app/interfaces/response.interface';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UserRepository) {}

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
  ): Promise<ServiceResponse<{ id: number; username: string; name: string }>> {
    const user = await this.usersRepository.findOne(id);
    return {
      success: true,
      message: 'User profile fetch successfully',
      data: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    };
  }

  async updateProfile(
    id: number,
    name: string,
  ): Promise<ServiceResponse<{ id: number; username: string; name: string }>> {
    const updatedUser = await this.usersRepository.update(id, { name });
    return {
      success: true,
      message: 'User profile updated successfully',
      data: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.name,
      },
    };
  }
}
