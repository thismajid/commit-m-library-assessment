import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { AuthService } from '@app/interfaces/auth.service.interface';
import { ApiLogin, ApiRegister } from './decorators';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(GrpcResponseInterceptor)
export class AuthController {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('register')
  @ApiRegister()
  register(@Body() data: { name: string; username: string; password: string }) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiLogin()
  login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data);
  }
}
