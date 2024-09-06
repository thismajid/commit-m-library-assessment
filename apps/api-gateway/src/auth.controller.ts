import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { AuthService } from '@app/interfaces/auth.service.interface';

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
  @ApiOperation({ summary: 'Register user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  register(@Body() data: { name: string; username: string; password: string }) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'User login successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  login(@Body() data: { username: string; password: string }) {
    return this.authService.login(data);
  }
}
