import HttpException from "./HttpException";

export class InvalidRequestException extends HttpException {
  constructor() {
    super(400, `Bad Request`, false);
  }
}

export class InternalServerError extends HttpException {
  constructor() {
    super(500, `Internal server error`, false);
  }
}
