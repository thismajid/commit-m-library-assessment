import {
  Controller,
  Inject,
  Get,
  Req,
  UseGuards,
  Body,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { UserService } from '@app/interfaces/user-service.interface';

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
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  profile(@Req() req) {
    return this.userService.getUserProfile({
      id: req.user.userId,
    });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Update user profile successfully' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  updateProfile(@Req() req, @Body() data: { name: string }) {
    return this.userService.updateUserProfile({
      id: req.user.userId,
      name: data.name,
    });
  }
}
