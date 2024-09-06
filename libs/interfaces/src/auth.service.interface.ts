import { Observable } from 'rxjs';

export interface RegisterInput {
  name: string;
  username: string;
  password: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  username: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface AuthService {
  register(data: RegisterInput): Observable<RegisterResponse | void>;
  login(data: LoginInput): Observable<LoginResponse>;
}
