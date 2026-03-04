import express from 'express';
import { protect, authorizeProjectRole, validate } from '../middlewares/auth.js';
import { ProjectRole } from '../types/role.type.js';

import {
  createTaskController,
  getTasksByProjectController,
  getSingleTaskController,
  updateTaskStatusController,
  deleteTaskController,
} from '../controller/task.js';

import {
  createTaskZodSchema,
  updateTaskStatusZodSchema,
} from '../types/zod.task.js';

import { asyncHandler } from '../utils/utilityFunctions.js';

const router = express.Router({ mergeParams: true });

/**
 * @route   POST /projects/:id/tasks
 * @desc    Create Task or Subtask
 * @access  PO, PM
 */
router.post(
  '/',
  protect,
  authorizeProjectRole([ProjectRole.PO, ProjectRole.PM]),
  validate(createTaskZodSchema),
  asyncHandler(createTaskController),
);

/**
 * @route   GET /projects/:id/tasks
 * @desc    Get all tasks of a project
 * @access  PO, PM, DEVELOPER
 */
router.get(
  '/',
  protect,
  authorizeProjectRole([
    ProjectRole.PO,
    ProjectRole.PM,
    ProjectRole.DEVELOPER,
  ]),
  asyncHandler(getTasksByProjectController),
);

/**
 * @route   GET /projects/:id/tasks/:taskId
 * @desc    Get single task details
 * @access  Project members
 */
router.get(
  '/:taskId',
  protect,
  authorizeProjectRole([
    ProjectRole.PO,
    ProjectRole.PM,
    ProjectRole.DEVELOPER,
  ]),
  asyncHandler(getSingleTaskController),
);

/**
 * @route   PATCH /projects/:projectId/tasks/:taskId/status
 * @desc    Update task status
 * @access  Developer (assigned only), PO, PM
 */
router.patch(
  '/:taskId/status',
  protect,
  authorizeProjectRole([
    ProjectRole.PO,
    ProjectRole.PM,
    ProjectRole.DEVELOPER,
  ]),
  validate(updateTaskStatusZodSchema),
  asyncHandler(updateTaskStatusController),
);

/**
 * @route   DELETE /projects/:id/tasks/:taskId
 * @desc    Delete a task
 * @access  PO, PM
 */
router.delete(
  '/:taskId',
  protect,
  authorizeProjectRole([ProjectRole.PO, ProjectRole.PM]),
  asyncHandler(deleteTaskController),
);

export { router as taskRoutes };