export class ResponseDto<T> {
  status_code: number;
  success: boolean;
  message: string;
  data: T | null;
  error: T | null;

  constructor(
    status_code: number,
    success: boolean,
    message: string,
    data: T | null,
    error: T | null
  ) {
    this.status_code = status_code;
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }
}
