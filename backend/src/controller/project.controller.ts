import { Request, Response } from 'express';

import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import {
  addProjectMemberService,
  createProjectService,
  deleteProjectService,
  getMyProjectsService,
  getProjectByIdService,
} from '../services/project.services.js';
import {
  AddProjectMemberBody,
  CreateProjectInput,
} from '../types/zod.project.js';
import { sendSuccessResponse } from '../utils/utilityFunctions.js';
import { controllerType } from '../types/controller.types.js';

export const getMyProjectsController: controllerType = async (req, res) => {
  const projects = await getMyProjectsService(req.userId!, req.userRole!);

  sendSuccessResponse(
    res,
    HTTP_STATUS.OK,
    'Projects fetched successfully',
    projects,
  );
};

export const createProjectController: controllerType = async (req, res) => {
  const { name, description } = req?.validatedData as CreateProjectInput;

  const project = await createProjectService({
    name,
    description,
    adminId: req.userId!,
  });

  sendSuccessResponse(
    res,
    HTTP_STATUS.OK,
    'Project created successfully',
    project,
  );
};

export const addProjectMemberController: controllerType = async (req, res) => {
  const { projectId } = req.params as { projectId: string };

  const { userId, email, role } = req?.validatedData as AddProjectMemberBody;

  const updatedProject = await addProjectMemberService({
    projectId,
    userId,
    email,
    role,
    callerRole: req.userRole!,
  });

  sendSuccessResponse(
    res,
    HTTP_STATUS.OK,
    'Member added successfully',
    updatedProject,
  );
};

export const getProjectByIdController: controllerType = async (req, res) => {
  const { projectId } = req.params as { projectId: string };

  const project = await getProjectByIdService({
    projectId,
    requesterId: req.userId!,
    requesterRole: req.userRole!,
  });

  sendSuccessResponse(res, HTTP_STATUS.OK, 'Project found', project);
};

export const deleteProjectController: controllerType = async (req, res) => {
  const { projectId } = req.params as { projectId: string };
  await deleteProjectService({ projectId });
  sendSuccessResponse(res, HTTP_STATUS.OK, 'Project deleted successfully', {});
};
