import { Controller, Get, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CheckUserExistsRequest,
  CreateUserRequest,
} from './interfaces/user.interfaces';
import { from, Observable } from 'rxjs';

@Controller()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @GrpcMethod('UserService', 'CheckUserExists')
  @UsePipes(new ValidationPipe({ transform: true }))
  checkUserExists(
    data: CheckUserExistsRequest,
  ): Observable<{ exists: boolean }> {
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
}
