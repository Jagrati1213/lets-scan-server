interface apiResponseTypes {
  statusCode: number;
  statusText: string;
  data: any;
}

class ApiResponse {
  public statusCode: number;
  public statusText: string;
  public data: any;
  public success: boolean;
  constructor({ statusCode, statusText, data }: apiResponseTypes) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export { ApiResponse };
