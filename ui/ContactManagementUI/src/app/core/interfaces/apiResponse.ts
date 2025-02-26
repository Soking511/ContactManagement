export interface ApiResponse<T> {
    token: string;
    data: T;
  }