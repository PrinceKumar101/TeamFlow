interface ApiSuccess<T> {
  success: true;
  message: string;
  data?: T;
}
interface ApiError {
  success: false;
  message: string;
  error?: string[];
}
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
