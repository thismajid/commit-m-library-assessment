import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const secretKey = this.configService.get<string>('mainConfig.JWT_SECRET');
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: secretKey,
      });
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromRequest(req: any): string {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return null;
    }

    return authHeader.split(' ')[1];
  }
}
