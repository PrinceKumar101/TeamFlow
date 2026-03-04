import { Router } from 'express';
import { userRoutes } from './users.js';
import { projectRoute } from './projects.js';

const router = Router();
router.use('/auth', userRoutes);
router.use('/projects', projectRoute);

export default router;
