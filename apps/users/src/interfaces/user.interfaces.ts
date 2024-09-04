export interface GetUserByUsername {
  username: string;
}

export interface CreateUserRequest {
  name: string;
  username: string;
  password: string;
}
