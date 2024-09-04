import { Observable } from 'rxjs';

export interface AuthService {
  register(data: {
    name: string;
    username: string;
    password: string;
  }):
    | Promise<CreateTokenResponse>
    | Observable<CreateTokenResponse>
    | CreateTokenResponse;
}

export interface CreateTokenResponse {
  token: string;
}
