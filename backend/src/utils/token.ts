import jwt, { JwtPayload } from 'jsonwebtoken';
import { AppError } from './utilityFunctions.js';
import { GlobalRole } from '../types/role.type.js';

export type tokenDataType = {
  tokenId: string;
  userId: string;
  role: GlobalRole;
  name: string;
};
export const generateToken = (
  data: tokenDataType,
  expiresIn: number = 60 * 60,
  tokenType : "token" | "refreshToken" = "token"
): string => {
  const secret_key = tokenType === "refreshToken" ? process.env.JWT_REFRESH_SECRET_KEY : process.env.JWT_SECRET_KEY ;
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
    throw new AppError('Error verifying the token due to secret key.');
  }
  return jwt.verify(token, secret_key);
};
export const verifyRefreshToken = (token: string) => {
  const secret_key = process.env.JWT_REFRESH_SECRET_KEY;
  if (!secret_key) {
    throw new AppError('Error Verifying the token due to secret key.');
  }
  return jwt.verify(token, secret_key);
};
