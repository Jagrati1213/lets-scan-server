interface apiResponseTypes {
  statusCode: number;
  statusText: string;
  data: unknown;
}

class ApiResponse {
  public statusCode: number;
  public statusText: string;
  public data: unknown;
  public success: boolean;
  constructor({ statusCode, statusText, data }: apiResponseTypes) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export { ApiResponse };
