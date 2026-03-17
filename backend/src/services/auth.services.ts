import User  from '../models/user.model.js';
import { type userRegisterType } from '../types/zod.user.js';
import { generateToken } from '../utils/token.js';
import { comparePassoword, hashPassword } from '../utils/hash.js';
import { AppError } from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { ObjectId } from 'mongoose';

export const registerUserService = async (userData: userRegisterType) => {
  const foundUser = await User.findOne({ email: userData.email });

  if (foundUser)
    throw new AppError('User Already Exists', HTTP_STATUS.BAD_REQUEST);

  const hashedPassword = await hashPassword(userData.password);

  const newUser = new User({
    ...userData,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  if (!savedUser)
    throw new AppError(
      'User creation failed.',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );

  return savedUser;
};
export const loginUserService = async (
  userData: Pick<userRegisterType, 'email' | 'password'>,
) => {
  const foundUser = await User.findOne({ email: userData.email });

  if (!foundUser)
    throw new AppError(
      "User doesn't exist. Please register",
      HTTP_STATUS.UNAUTHORIZED,
    );

  const checkedPassword = await comparePassoword({
    password: userData.password,
    hashedPassword: foundUser.password,
  });

  if (!checkedPassword)
    throw new AppError('Incorrect password', HTTP_STATUS.BAD_REQUEST);

  return foundUser;
};

export const getMeService = async (userId: ObjectId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new AppError('user not found', HTTP_STATUS.UNAUTHORIZED);
  return user;
};
