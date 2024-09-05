import {
  Controller,
  Get,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  GetUserByUsername,
  CreateUserRequest,
} from './interfaces/user.interfaces';
import { from, Observable } from 'rxjs';

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
  async getProfile(data: { id: number }) {
    return this.userService.getProfile(data.id);
  }
}
