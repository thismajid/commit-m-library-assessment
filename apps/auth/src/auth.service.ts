import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { lastValueFrom, Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(
    name: string,
    username: string,
    password: string,
  ): Promise<Observable<{ id: number; username: string } | void>> {
    const { exists } = await lastValueFrom(
      this.userService.checkUserExists(username),
    );

    if (exists) {
      throw new BadRequestException('User exists');
    }

    const user = await lastValueFrom(
      this.userService.createUser(name, username, password),
    );

    return user;
  }

  async login(data: { username: string; password: string }) {
    const user = await lastValueFrom(
      this.userService.getUserByUsername(data.username),
    );

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    const token = this.generateToken(user.id);
    return { accessToken: token };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1d' });
  }
}
