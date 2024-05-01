interface apiResponseTypes {
  statusCode: number;
  message: string;
  data: any;
}

class ApiResponse {
  public statusCode: number;
  public message: string;
  public data: any;
  public success: boolean;
  constructor({ statusCode, message, data }: apiResponseTypes) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export { ApiResponse };
