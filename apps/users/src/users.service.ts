import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from './repositories/user.repository';
import { User } from '@app/interfaces/user.interface';

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

  async getProfile(id: number) {
    return await this.usersRepository.findOne(id);
  }
}
