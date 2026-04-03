import express from 'express';
import { protect, validate } from '../middlewares/auth.js';
import { userZodRegisterType } from '../types/zod.user.js';
import {
  getMeController,
  loginUserController,
  logoutController,
  refreshTokenController,
  registerUserController,
} from '../controller/auth.controller.js';
import { getAllUsersController } from '../controller/user.controller.js';
import { asyncHandler } from '../utils/utilityFunctions.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello there from users route.');
});

router.post(
  '/register',
  validate(userZodRegisterType.omit({ role: true })),
  asyncHandler(registerUserController),
);

router.post(
  '/login',
  validate(userZodRegisterType.pick({ email: true, password: true })),
  asyncHandler(loginUserController),
);

router.post('/logout', protect, asyncHandler(logoutController));

router.get('/me', protect, asyncHandler(getMeController));

router.get('/users', protect, asyncHandler(getAllUsersController));

router.post('/refreshToken', asyncHandler(refreshTokenController));
export { router as userRoutes };
