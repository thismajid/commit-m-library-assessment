import { Observable } from 'rxjs';
import { ServiceResponse } from './response.interface';

export interface RegisterInput {
  name: string;
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterResponse
  extends ServiceResponse<{
    id: number;
    username: string;
  }> {
  success: boolean;
  message: string;
}

export interface LoginResponse
  extends ServiceResponse<{ accessToken: string }> {}

export interface AuthService {
  register(data: RegisterInput): Observable<RegisterResponse>;
  login(data: LoginInput): Observable<LoginResponse>;
}
