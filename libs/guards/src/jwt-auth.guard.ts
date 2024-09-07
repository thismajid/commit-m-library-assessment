import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly JWT_SECRET = 'your-secret-key';

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }

    try {
      const decoded = this.verifyToken(token);
      request.user = decoded; // Attach user information to the request object
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

    return authHeader.split(' ')[1]; // Assuming 'Bearer <token>' format
  }

  private verifyToken(token: string): any {
    return jwt.verify(token, this.JWT_SECRET);
  }
}
