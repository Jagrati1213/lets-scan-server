interface ApiErrorOptions {
  statusCode: number;
  statusText?: string;
}

class ApiErrors {
  public statusCode: number;
  public statusText: string;
  public data: unknown;
  public success: boolean;

  constructor({
    statusCode,
    statusText = "Something went wrong",
  }: ApiErrorOptions) {
    this.statusCode = statusCode;
    this.statusText = statusText;
    this.data = null;
    this.success = false;
  }
}

export { ApiErrors };
