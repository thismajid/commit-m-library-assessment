import {
  Controller,
  Post,
  Body,
  Inject,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { AuthService } from '@app/interfaces/auth.service.interface';
import { ApiLogin, ApiRegister } from './decorators';
import { LoginDto, RegisterDto } from '@app/dtos/auth.dto';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(GrpcResponseInterceptor)
@UsePipes(new ValidationPipe())
export class AuthController {
  private authService: AuthService;

  constructor(@Inject('AUTH_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Post('register')
  @ApiRegister()
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  @ApiLogin()
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
