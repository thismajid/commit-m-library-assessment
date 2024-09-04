import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { lastValueFrom, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(
    name: string,
    username: string,
    password: string,
  ): Promise<Observable<{ id: number; username: string } | void>> {
    const { exists } = await lastValueFrom(
      this.userService.checkUserExists(username),
    );

    if (exists) {
      throw new BadRequestException('User exists');
    }

    const user = await lastValueFrom(
      this.userService.createUser(name, username, password),
    );

    return user;
  }
}
