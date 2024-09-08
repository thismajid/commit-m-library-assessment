import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { ServiceResponse } from '@app/interfaces/response.interface';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ id: number; username: string }>> {
    const result = await this.authService.register(data);
    return {
      success: true,
      message: 'User registered successfully',
      data: result,
    };
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: {
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ accessToken: string }>> {
    const result = await this.authService.login(data);
    return {
      success: true,
      message: 'User login successfully',
      data: result,
    };
  }

  @GrpcMethod('AuthService', 'Authenticate')
  validateToken(data: { token: string }) {
    try {
      const decoded = this.authService.verifyToken(data.token);
      return { isValid: true, userId: decoded.userId };
    } catch (err) {
      return { isValid: false, userId: null };
    }
  }
}
