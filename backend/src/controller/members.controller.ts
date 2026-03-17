import {
  addMemberService,
  getAllMemberService,
} from '../services/members.services.js';
import { controllerType } from '../types/controller.types.js';
import { addMemberType } from '../types/zod.member.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { sendSuccessResponse } from '../utils/utilityFunctions.js';

export const addMemberController: controllerType = async (req, res) => {
  const { projectId } = req.params as { projectId: string };
  const { userId, role } = req.validatedData as addMemberType;
  const updatedProject = await addMemberService({ projectId, userId, role });
  sendSuccessResponse(res, HTTP_STATUS.CREATED, 'Member added', updatedProject);
};

export const getAllMemberController: controllerType = async (req, res) => {
  const { projectId } = req.params as { projectId: string };

  const members = await getAllMemberService(projectId);
  sendSuccessResponse(res, HTTP_STATUS.OK, 'Members found', members);
};
