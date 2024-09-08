import {
  Controller,
  Inject,
  Get,
  Req,
  Body,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { UserService } from '@app/interfaces/user-service.interface';
import { ApiProfile, ApiUpdateProfile } from './decorators';

@ApiTags('users')
@Controller('users')
@UseInterceptors(GrpcResponseInterceptor)
export class UserController {
  private userService: UserService;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserService>('UserService');
  }

  @Get('profile')
  @ApiProfile()
  profile(@Req() req) {
    return this.userService.getUserProfile({
      id: req.user.userId,
    });
  }

  @Patch('profile')
  @ApiUpdateProfile()
  updateProfile(@Req() req, @Body() data: { name: string }) {
    return this.userService.updateUserProfile({
      id: req.user.userId,
      name: data.name,
    });
  }
}
