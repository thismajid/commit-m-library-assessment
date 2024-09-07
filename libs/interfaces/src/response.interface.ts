export interface IResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ServiceResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
