import { User } from '@app/interfaces/user.interface';
import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface UserServiceClient {
  checkUserExists(request: {
    username: string;
  }): Observable<{ exists: boolean }>;
  createUser(request: {
    name: string;
    username: string;
    password: string;
  }): Observable<any>;
  getUserByUsername(request: { username: string }): Observable<User>;
}

@Injectable()
export class UserService implements OnModuleInit {
  private userService: UserServiceClient;

  constructor(@Inject('USER_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService = this.client.getService<UserServiceClient>('UserService');
  }

  checkUserExists(username: string): Observable<{ exists: boolean }> {
    return this.userService.checkUserExists({ username });
  }

  async createUser(
    name: string,
    username: string,
    password: string,
  ): Promise<Observable<any>> {
    return await this.userService.createUser({ name, username, password });
  }

  getUserByUsername(username: string): Observable<User> {
    return this.userService.getUserByUsername({ username });
  }
}
