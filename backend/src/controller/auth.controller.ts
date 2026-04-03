import { controllerType } from '../types/controller.types.js';
import { createHash, randomUUID } from 'node:crypto';
import { AppError, sendSuccessResponse } from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { type userRegisterType } from '../types/zod.user.js';
import {
  clearRefreshTokenService,
  getMeService,
  loginUserService,
  refreshTokenService,
  registerUserService,
} from '../services/auth.services.js';
import { generateToken, tokenDataType, verifyRefreshToken } from '../utils/token.js';
import { GlobalRole } from '../types/role.type.js';

const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const hashToken = (token: string) =>
  createHash('sha256').update(token).digest('hex');

export const registerUserController: controllerType = async (req, res) => {
  const { name, email, password } = req.validatedData as Omit<
    userRegisterType,
    'role'
  >;

  const user = await registerUserService({
    name,
    email,
    password,
    role: GlobalRole.USER,
  });

  const token = generateToken({
    tokenId: randomUUID(),
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
  });

  const refreshTokenId = randomUUID();
  const refreshToken = generateToken(
    {
      tokenId: refreshTokenId,
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
    },
    REFRESH_TOKEN_TTL_SECONDS,
    'refreshToken',
  );

  user.refreshToken = {
    tokenId: refreshTokenId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    createdAt: new Date(),
  };
  await user.save();

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15, // 15 mins
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, 'User registered successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};

export const loginUserController: controllerType = async (req, res) => {
  const { email, password } = req.validatedData as Pick<
    userRegisterType,
    'email' | 'password'
  >;

  const user = await loginUserService({ email, password });

  const token = generateToken({
    tokenId: randomUUID(),
    userId: user._id.toString(),
    role: user.role,
    name: user.name,
  });

  const refreshTokenId = randomUUID();
  const refreshToken = generateToken(
    {
      tokenId: refreshTokenId,
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
    },
    REFRESH_TOKEN_TTL_SECONDS,
    'refreshToken',
  );

  user.refreshToken = {
    tokenId: refreshTokenId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
    createdAt: new Date(),
  };
  await user.save();

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, 'User logged in successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
export const logoutController: controllerType = async (req, res) => {
  if (req.userId) {
    await clearRefreshTokenService(req.userId);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Logged out successfully', {});
};

export const getMeController: controllerType = async (req, res) => {
  const user = await getMeService(req.userId!);
  sendSuccessResponse(res, HTTP_STATUS.OK, 'User fetched successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
export const refreshTokenController : controllerType = async (req, res) =>{
  const clientSideToken = req.cookies.refreshToken;
  if (!clientSideToken) {
    throw new AppError('Refresh token is required', HTTP_STATUS.UNAUTHORIZED);
  }

  const decodedToken = verifyRefreshToken(clientSideToken) as tokenDataType;
  const user = await refreshTokenService(decodedToken.userId);

  if (!user.refreshToken) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (decodedToken.tokenId !== user.refreshToken.tokenId) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  if (new Date(user.refreshToken.expiresAt).getTime() <= Date.now()) {
    throw new AppError('Refresh token expired', HTTP_STATUS.UNAUTHORIZED);
  }

  if (hashToken(clientSideToken) !== user.refreshToken.tokenHash) {
    throw new AppError('Invalid refresh token', HTTP_STATUS.UNAUTHORIZED);
  }

  const accessToken = generateToken({
    tokenId: randomUUID(),
    userId: user._id.toString(),
    role: user.role,
    name: decodedToken.name,
  });

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Access token refreshed', {
    id: user._id,
    role: user.role,
  });
};
