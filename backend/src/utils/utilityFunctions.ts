import {
  ErrorRequestHandler,
  RequestHandler,
  Response,
} from 'express';
import { ApiResponse } from '../types/responseType.js';

export const sendSuccessResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: string[],
): Response<ApiResponse<never>> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};

export const asyncHandler =
  (fn: RequestHandler): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export class AppError extends Error {
  public statusCode: number;
  public errors?: string[];

  constructor(message: string, statusCode = 500, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    if (errors) this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
export const errorMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    return sendErrorResponse(res, err.statusCode, err.message, err.errors);
  }

  console.error(err);

  return sendErrorResponse(res, 500, 'Internal Server Error');
};
