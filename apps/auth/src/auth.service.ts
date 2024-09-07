import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { lastValueFrom, Observable } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { ServiceResponse } from '@app/interfaces/response.interface';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ id: number; username: string }>> {
    const { exists } = await lastValueFrom(
      this.userService.checkUserExists(data.username),
    );

    if (exists) {
      return { success: false, message: 'User already exists' };
    }

    const user = await lastValueFrom(
      await this.userService.createUser(
        data.name,
        data.username,
        data.password,
      ),
    );

    return {
      success: true,
      message: 'User registered successfully',
      data: user,
    };
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ accessToken: string }>> {
    const user = await lastValueFrom(
      this.userService.getUserByUsername(data.username),
    );

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid password' };
    }

    const token = this.generateToken(user.id);
    return {
      success: true,
      message: 'Login successful',
      data: { accessToken: token },
    };
  }

  private generateToken(userId: number): string {
    return jwt.sign({ userId }, 'your-secret-key', { expiresIn: '1d' });
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, 'your-secret-key');
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
