class HttpException extends Error {
  public status: number;
  public success: boolean;
  public message: string;
  constructor(status: number, message: string, success: boolean) {
    super(message);
    this.status = status;
    this.success = success;
    this.message = message;
  }
}

export default HttpException;
