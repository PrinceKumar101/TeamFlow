import { controllerType } from '../types/controller.types.js';
import {
  sendSuccessResponse,
} from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { type userRegisterType } from '../types/zod.user.js';
import {
  getMeService,
  loginUserService,
  registerUserService,
} from '../services/auth.services.js';
import { generateToken } from '../utils/token.js';
import { GlobalRole } from '../types/role.type.js';

export const registerUserController: controllerType = async (req, res) => {
  const { name, email, password } = req.validatedData as Omit<userRegisterType, "role">;

  const user = await registerUserService({ name, email, password, role : GlobalRole.USER });

  const token = generateToken({
    id: user._id,
    role: user.role,
    name: user.name,
  });

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 15, // 15 mins
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
    id: user._id,
    role: user.role ,
    name: user.name,
  });

  res.cookie('accessToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 1000 * 60 * 60,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, 'User logged in successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
export const logoutController: controllerType = async (req, res) => {
  res.clearCookie('accessToken');

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Logged out successfully', {});
};

export const getMeController: controllerType = async (req, res) => {
  const user = await getMeService(req.userId);
  sendSuccessResponse(res, HTTP_STATUS.OK, 'User fetched successfully', {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
};
