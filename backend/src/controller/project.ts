import { Request, Response } from 'express';

import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import {
  addProjectMemberService,
  createProjectService,
  getMyProjectsService,
  getProjectByIdService,
} from '../services/project.services.js';
import {
  AddProjectMemberBody,
  CreateProjectInput,
} from '../types/zod.project.js';
import { sendSuccessResponse } from '../utils/utilityFunctions.js';

export const getMyProjectsController = async (req: Request, res: Response) => {
  const projects = await getMyProjectsService(req.userId!, req.userRole!);

  sendSuccessResponse(
    res,
    HTTP_STATUS.OK,
    'Projects fetched successfully',
    projects,
  );
};

export const createProjectController = async (req: Request, res: Response) => {
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

export const addProjectMemberController = async (
  req: Request,
  res: Response,
) => {
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

export const getProjectByIdController = async (
  req: Request,
  res: Response
) => {
  const { projectId } = req.params as { projectId: string };

  const project = await getProjectByIdService({
    projectId,
    requesterId: req.userId!,
    requesterRole: req.userRole!,
  });

 sendSuccessResponse(res, HTTP_STATUS.OK, "Project found", project);
};
