import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod, Payload } from '@nestjs/microservices';
import { Observable } from 'rxjs';
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
    return this.authService.register(data);
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: {
    username: string;
    password: string;
  }): Promise<ServiceResponse<{ accessToken: string }>> {
    return this.authService.login(data);
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
