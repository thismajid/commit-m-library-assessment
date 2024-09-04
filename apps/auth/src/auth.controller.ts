import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { GrpcMethod } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('AuthService', 'Register')
  async register(data: {
    name: string;
    username: string;
    password: string;
  }): Promise<Observable<{ id: number; username: string } | void>> {
    return await this.authService.register(
      data.name,
      data.username,
      data.password,
    );
  }

  @GrpcMethod('AuthService', 'Login')
  async login(data: { username: string; password: string }) {
    return this.authService.login(data);
  }
}
