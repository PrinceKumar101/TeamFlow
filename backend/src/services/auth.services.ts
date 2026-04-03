import User  from '../models/user.model.js';
import { type userRegisterType } from '../types/zod.user.js';
import { compareHash, hash } from '../utils/hash.js';
import { AppError } from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';

export const registerUserService = async (userData: userRegisterType) => {
  const foundUser = await User.findOne({ email: userData.email });

  if (foundUser)
    throw new AppError('User Already Exists', HTTP_STATUS.BAD_REQUEST);

  const hashedPassword = await hash(userData.password);

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

  const checkedPassword = await compareHash({
    plaintext: userData.password,
    hashedText: foundUser.password,
  });

  if (!checkedPassword)
    throw new AppError('Incorrect password', HTTP_STATUS.BAD_REQUEST);

  return foundUser;
};

export const getMeService = async (userId: string) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw new AppError('user not found', HTTP_STATUS.UNAUTHORIZED);
  return user;
};

export const refreshTokenService = async (userId: string) =>{
  const user = await User.findById(userId).select('_id refreshToken isBlocked role');
  if(!user || !user.refreshToken) throw new AppError("User not found", HTTP_STATUS.UNAUTHORIZED);
  if(user.isBlocked) throw new AppError("User blocked", HTTP_STATUS.FORBIDDEN);
  return user;
}

export const clearRefreshTokenService = async (userId: string) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
};
