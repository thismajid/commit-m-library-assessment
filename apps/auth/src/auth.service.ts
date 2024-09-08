import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { lastValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { User } from '@app/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<User> {
    const { exists } = await lastValueFrom(
      this.userService.checkUserExists(data.username),
    );

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const user = (await lastValueFrom(
      await this.userService.createUser(
        data.name,
        data.username,
        data.password,
      ),
    )) as User;

    return user;
  }

  async login(data: {
    username: string;
    password: string;
  }): Promise<{ accessToken: string }> {
    const user = await lastValueFrom(
      this.userService.getUserByUsername(data.username),
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const token = this.generateToken(user.id, user.role);

    return {
      accessToken: token,
    };
  }

  private generateToken(userId: number, role: string): string {
    const secretKey = this.configService.get<string>('mainConfig.JWT_SECRET');
    const expiresIn = this.configService.get<string>(
      'mainConfig.JWT_EXPIRATION',
      '1d',
    );

    return this.jwtService.sign(
      { userId, role },
      { secret: secretKey, expiresIn },
    );
  }

  verifyToken(token: string): any {
    try {
      return jwt.verify(token, 'your-secret-key');
    } catch (err) {
      throw new Error('Invalid token');
    }
  }
}
