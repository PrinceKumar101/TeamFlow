import express from 'express';
import { authorizeGlobal, authorizeProjectRole, protect, validate } from '../middlewares/auth.js';
import { GlobalRole, ProjectRole } from '../types/role.type.js';
import {
  addProjectMemberController,
  createProjectController,
  getProjectByIdController,
  getMyProjectsController,
} from '../controller/project.js';
import { asyncHandler } from '../utils/utilityFunctions.js';
import { addProjectMemberBodySchema, createProjectZodSchema } from '../types/zod.project.js';
import { taskRoutes } from './tasks.js';

const router = express.Router();

// Get all projects for the current user
router.get('/', protect, asyncHandler(getMyProjectsController));

router.post(
  '/',
  protect,   
  validate(createProjectZodSchema.omit({adminId: true})),
  authorizeGlobal([GlobalRole.ADMIN]),
  asyncHandler(createProjectController),
);

router.patch(
  '/:projectId/add-member',
  protect,
  validate(addProjectMemberBodySchema),
  authorizeProjectRole([ProjectRole.PO, ProjectRole.PM]),
  asyncHandler(addProjectMemberController),
);

router.get('/:projectId', protect, asyncHandler(getProjectByIdController));

// Nest task routes under projects
router.use('/:projectId/tasks', taskRoutes);

export { router as projectRoute };
