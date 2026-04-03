import { NextFunction, Request, Response } from 'express';
import { AppError, sendErrorResponse } from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { ZodTypeAny } from 'zod';
import { tokenDataType, verifyToken } from '../utils/token.js';
import { GlobalRole, ProjectRole } from '../types/role.type.js';
import Project from '../models/project.model.js';

export const validate = (schema: ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((err) => err.message);
      return sendErrorResponse(
        res,
        HTTP_STATUS.BAD_REQUEST,
        'User data not correct',
        errors,
      );
    }
    req.validatedData = result.data;
    next();
  };
};


export const protect = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken;

  if (!token)
    throw new AppError("Not authorized", HTTP_STATUS.UNAUTHORIZED);

  const decoded = verifyToken(token) as tokenDataType

  req.userId = decoded?.userId;
  req.userRole = decoded?.role
  next();
};

export const authorizeGlobal =
  (allowedRoles: GlobalRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.userRole) {
      throw new AppError("Role not found", HTTP_STATUS.FORBIDDEN);
    }

    if (!allowedRoles.includes(req.userRole as GlobalRole)) {
      throw new AppError(
        "You are not allowed to perform this action",
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };

  export const authorizeProjectRole =
  (allowedRoles: ProjectRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const projectId = req.params.projectId;

    if (!projectId) {
      throw new AppError("Project ID missing", HTTP_STATUS.BAD_REQUEST);
    }

    // Global ADMIN can do anything in any project
    if (req.userRole === GlobalRole.ADMIN) {
      return next();
    }

    const project = await Project.findById(projectId);

    if (!project) {
      throw new AppError("Project not found", HTTP_STATUS.NOT_FOUND);
    }

    const member = project.members.find(
      (m) => m.user.toString() === req.userId
    );

    if (!member) {
      throw new AppError(
        "You are not a member of this project",
        HTTP_STATUS.FORBIDDEN
      );
    }

    if (!allowedRoles.includes(member.role)) {
      throw new AppError(
        "You do not have permission in this project",
        HTTP_STATUS.FORBIDDEN
      );
    }

    next();
  };