import { Response } from 'express';
import { responseType } from '../types/responseType.js';
import { success } from 'zod';

export const sendSuccess = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): Response => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  } satisfies responseType<T>);
};

export const sendError = <T>(
  res: Response,
  statusCode: number,
  message: string,
  errors: string[],
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  } satisfies responseType<T>);
};

class NewError extends Error {
  constructor(message:string, statusCode:number, errors:string[]){
    super(message);
  }  


}