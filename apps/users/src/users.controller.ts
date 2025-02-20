import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetUserByUsername,
  CreateUserRequest,
} from './interfaces/user.interfaces';
import { from, Observable } from 'rxjs';
import { ServiceResponse } from '@app/interfaces/response.interface';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod('UserService', 'CheckUserExists')
  @UsePipes(new ValidationPipe({ transform: true }))
  checkUserExists(data: GetUserByUsername): Observable<{ exists: boolean }> {
    return from(
      this.userService
        .checkUserExists(data.username)
        .then((exists) => ({ exists })),
    );
  }

  @GrpcMethod('UserService', 'CreateUser')
  @UsePipes(new ValidationPipe({ transform: true }))
  createUser(
    data: CreateUserRequest,
  ): Observable<{ id: number; username: string }> {
    return from(this.userService.createUser(data));
  }

  @GrpcMethod('UserService', 'GetUserByUsername')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUserByUsername(
    data: GetUserByUsername,
  ): Observable<{ id: number; username: string }> {
    return from(this.userService.getUserByUsername(data.username));
  }

  @GrpcMethod('UserService', 'GetUserProfile')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProfile(data: {
    id: number;
  }): Promise<ServiceResponse<{ id: number; username: string; name: string }>> {
    const result = await this.userService.getProfile(data.id);
    return {
      success: true,
      message: 'User profile fetch successfully',
      data: result,
    };
  }

  @GrpcMethod('UserService', 'UpdateUserProfile')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateProfile(data: {
    id: number;
    name: string;
  }): Promise<ServiceResponse<{ id: number; username: string; name: string }>> {
    const result = await this.userService.updateProfile(data.id, data.name);
    return {
      success: true,
      message: 'User profile fetch successfully',
      data: result,
    };
  }
}
