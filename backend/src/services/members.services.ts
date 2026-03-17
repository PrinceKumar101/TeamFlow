import Project, { IProjectMember  } from '../models/project.model.js';
import User from '../models/user.model.js';
import { ProjectRole } from '../types/role.type.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { AppError } from '../utils/utilityFunctions.js';
import { Types } from 'mongoose';

export const addMemberService = async ({
  projectId,
  userId,
  role,
}: {
  projectId: string;
  userId: string;
  role: ProjectRole;
}) => {
  const project = await Project.findById(projectId);
  if (!project) throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);

  const user = await User.findById(userId);

  if (!user) throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);

  const alreadyMember = project.members.find(
    (member) => member.user.toString() === userId,
  );

  if (alreadyMember)
    throw new AppError('User already a member', HTTP_STATUS.BAD_REQUEST);

  project.members.push({
    user: new Types.ObjectId(userId),
    role,
  });
  await project.save();
  return project;
};

export const getAllMemberService = async (projectId: string): Promise<IProjectMember[]> => {
  const project = await Project.findById(projectId).populate(
    'members.user',
    'name email',
  );

  if (!project)
    throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);

  return project.members;
};
