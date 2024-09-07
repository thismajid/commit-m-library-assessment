import { Observable } from 'rxjs';
import { ServiceResponse } from './response.interface';

export interface GetUserProfileInput {
  id: number;
}

export interface UpdateUserProfileInput {
  id: number;
  name: string;
}

export interface UserProfile
  extends ServiceResponse<{ id: number; name: string; username: string }> {}

export interface UserService {
  getUserProfile(data: GetUserProfileInput): Observable<UserProfile>;
  updateUserProfile(data: UpdateUserProfileInput): Observable<UserProfile>;
}
