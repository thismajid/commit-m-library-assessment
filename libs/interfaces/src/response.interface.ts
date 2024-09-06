export interface Response<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  statusCode: number;
  timestamp: string;
  path: string;
}
