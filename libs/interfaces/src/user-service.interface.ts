import { Observable } from 'rxjs';

export interface GetUserProfileInput {
  id: number;
}

export interface UpdateUserProfileInput {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  name: string;
  username: string;
}

export interface UserService {
  getUserProfile(data: GetUserProfileInput): Observable<UserProfile | void>;
  updateUserProfile(
    data: UpdateUserProfileInput,
  ): Observable<UserProfile | void>;
}
