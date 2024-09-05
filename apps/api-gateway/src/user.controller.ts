import {
  Controller,
  Inject,
  HttpStatus,
  HttpException,
  Get,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { JwtAuthGuard } from '@app/guards/jwt-auth.guard';

interface UserService {
  getUserProfile(data: { id: number }): Observable<{
    id: number;
    name: string;
    username: string;
  } | void>;
}

@ApiTags('users')
@Controller('users')
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
  async profile(@Req() req) {
    try {
      const response = this.userService.getUserProfile({
        id: req.user.userId,
      });
      const result = await lastValueFrom(response);

      return {
        statusCode: HttpStatus.OK,
        message: 'User fetch profile successfully',
        data: result,
      };
    } catch (error) {
      console.log(error);
    }
  }
}
