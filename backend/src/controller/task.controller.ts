import { Request, Response } from 'express';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import {
  createTaskService,
  getTasksByProjectService,
  updateTaskStatusService,
  getSingleTaskService,
  deleteTaskService,
} from '../services/task.services.js';
import { createTaskType, updateTaskStatusType } from '../types/zod.task.js';
import { AppError, sendSuccessResponse } from '../utils/utilityFunctions.js';
import { AddProjectMemberInput } from '../types/zod.project.js';
import { controllerType } from '../types/controller.types.js';

/**
 * @desc    Create Task or Subtask
 * @route   POST /projects/:id/tasks
 * @access  PO, PM
 */
export const createTaskController: controllerType = async (
  req: Request,
  res: Response,
) => {
  const { projectId } = req.params as Pick<AddProjectMemberInput, 'projectId'>;

  if (!projectId) {
    throw new AppError('Project ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const { title, description, assignedTo, priority, dueDate, parentTaskId } =
    req.validatedData as createTaskType;

  const task = await createTaskService({
    projectId,
    title,
    description,
    assignedTo,
    priority,
    dueDate,
    parentTaskId,
    createdBy: req.userId!,
  });

  sendSuccessResponse(
    res,
    HTTP_STATUS.CREATED,
    'Task created successfully',
    task,
  );
};

/**
 * @desc    Get All Tasks By Project
 * @route   GET /projects/:id/tasks
 * @access  Project members
 */
export const getTasksByProjectController: controllerType = async (
  req: Request,
  res: Response,
) => {
  const { projectId } = req.params as Pick<AddProjectMemberInput, 'projectId'>;

  if (!projectId) {
    throw new AppError('Project ID is required', HTTP_STATUS.BAD_REQUEST);
  }

  const tasks = await getTasksByProjectService(projectId);

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Tasks fetched successfully', tasks);
};

/**
 * @desc    Get Single Task
 * @route   GET /projects/:id/tasks/:taskId
 * @access  Project members
 */
export const getSingleTaskController: controllerType = async (
  req: Request,
  res: Response,
) => {
  const { taskId } = req.params;

  if (!taskId || Array.isArray(taskId)) {
    throw new AppError('Invalid taskId parameter', HTTP_STATUS.BAD_REQUEST);
  }

  const task = await getSingleTaskService(taskId);

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Task fetched successfully', task);
};

/**
 * @desc    Update Task Status
 * @route   PATCH /projects/:id/tasks/:taskId/status
 * @access  Developer (assigned only), PO, PM
 */
export const updateTaskStatusController: controllerType = async (
  req: Request,
  res: Response,
) => {
  const { taskId } = req.params;

  if (!taskId || Array.isArray(taskId)) {
    throw new AppError('Invalid taskId parameter', HTTP_STATUS.BAD_REQUEST);
  }

  const { status } = req.validatedData as updateTaskStatusType;

  const updatedTask = await updateTaskStatusService({
    taskId,
    requesterId: req.userId!,
    requesterRole: req.userRole!,
    newStatus: status,
  });

  sendSuccessResponse(
    res,
    HTTP_STATUS.OK,
    'Task status updated successfully',
    updatedTask,
  );
};

/**
 * @desc    Delete Task
 * @route   DELETE /projects/:id/tasks/:taskId
 * @access  PO, PM
 */
export const deleteTaskController: controllerType = async (
  req: Request,
  res: Response,
) => {
  const { taskId } = req.params;

  if (!taskId || Array.isArray(taskId)) {
    throw new AppError('Invalid taskId parameter', HTTP_STATUS.BAD_REQUEST);
  }

  await deleteTaskService(taskId);

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Task deleted successfully', null);
};
