interface ApiErrorOptions {
  statusCode: number;
  message?: string;
  errors?: string[];
}

class ApiErrors extends Error {
  public statusCode: number;
  public message: string;
  public errors: string[];
  public data: any;
  public success: boolean;

  constructor({
    statusCode,
    message = "Something went wrong",
    errors = [],
  }: ApiErrorOptions) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.data = null;
    this.success = false;
  }
}

export { ApiErrors };
