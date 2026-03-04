import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './utilityFunctions.js';
import { ObjectId } from 'mongodb';
import { GlobalRole } from '../types/role.type.js';

export type tokenDataType = {
  id: ObjectId;
  role: GlobalRole;
  name: string;
};
export const generateToken = (
  data: tokenDataType,
  expiresIn: number = 60 * 60,
): string => {
  const secret_key = process.env.JWT_SECRET_KEY;
  if (!secret_key) {
    throw new Error('Error generating the token due to secret key.');
  }
  return jwt.sign(
    data,
    secret_key,
    { expiresIn },
  );
};

export const verifyToken = (token: string) => {
  const secret_key = process.env.JWT_SECRET_KEY;
  if (!secret_key) {
    throw new AppError('Error generating the token due to secret key.');
  }
  return jwt.verify(token, secret_key);
};
