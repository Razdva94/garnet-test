import { HttpException } from '@nestjs/common';

export class TokenExpiredError extends HttpException {
  constructor() {
    super(
      {
        statusCode: 401,
        errorCode: 'TOKEN_EXPIRED',
        message: 'Access token expired',
      },
      401,
    );
  }
}

export class InvalidTokenError extends HttpException {
  constructor() {
    super(
      {
        statusCode: 401,
        errorCode: 'INVALID_TOKEN',
        message: 'Invalid or missing token',
      },
      401,
    );
  }
}
