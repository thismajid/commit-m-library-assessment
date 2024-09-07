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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';
import { GrpcResponseInterceptor } from '@app/interceptors/GrpcResponse.interceptor';
import { UserService } from '@app/interfaces/user-service.interface';
import { UpdateProfileDto } from '@app/dtos/users.dto';

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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'User profile' })
  @ApiResponse({ status: 200, description: 'User profile fetch successfully' })
  @ApiResponse({ status: 401, description: 'Bad request' })
  profile(@Req() req) {
    return this.userService.getUserProfile({
      id: req.user.userId,
    });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Bad request' })
  @ApiBody({ type: UpdateProfileDto })
  updateProfile(@Req() req, @Body() data: { name: string }) {
    return this.userService.updateUserProfile({
      id: req.user.userId,
      name: data.name,
    });
  }
}
