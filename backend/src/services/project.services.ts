import Project from '../models/project.js';
import User  from '../models/user.js';
import { GlobalRole, ProjectRole } from '../types/role.type.js';
import type { AddProjectMemberInput, CreateProjectInput } from '../types/zod.project.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { AppError } from '../utils/utilityFunctions.js';

export const getMyProjectsService = async (userId: string, userRole: string) => {
  // Admin can see all projects
  if (userRole === GlobalRole.ADMIN) {
    const projects = await Project.find()
      .populate('createdBy', 'name email')
      .populate('members.user', 'name email role');
    return projects;
  }

  // Regular users see only projects they are a member of
  const projects = await Project.find({ 'members.user': userId })
    .populate('createdBy', 'name email')
    .populate('members.user', 'name email role');
  return projects;
};

export const createProjectService = async ({ ...projectData }: CreateProjectInput) => {
  if (!projectData.name)
    throw new AppError('Project name is required', HTTP_STATUS.BAD_REQUEST);
  const newProject = new Project({
    name: projectData.name,
    description: projectData.description,
    createdBy: projectData.adminId,
    members: [],
  });
  const newSavedProject = await newProject.save();
  if (!newSavedProject)
    throw new AppError(
      'Failed creating project',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  return newSavedProject;
};



export const addProjectMemberService = async ({
  projectId,
  userId,
  email,
  role,
  callerRole,
}: AddProjectMemberInput & { callerRole: string }) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", HTTP_STATUS.NOT_FOUND);
  }

  // Look up user by ID or email
  const user = userId
    ? await User.findById(userId)
    : await User.findOne({ email: email as string });

  if (!user) {
    throw new AppError(
      userId ? "User not found" : `No user found with email: ${email}`,
      HTTP_STATUS.NOT_FOUND
    );
  }

  // Prevent adding ADMIN as project member
  if (user.role === GlobalRole.ADMIN) {
    throw new AppError(
      "Admin cannot be assigned project roles",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // PO/PM can only add DEVELOPERs — only ADMIN can assign PO/PM roles
  if (callerRole !== GlobalRole.ADMIN && role !== ProjectRole.DEVELOPER) {
    throw new AppError(
      "You can only add members with the DEVELOPER role",
      HTTP_STATUS.FORBIDDEN
    );
  }

  const resolvedUserId = user._id.toString();

  // Check duplicate member
  const alreadyMember = project.members.find(
    (m) => m.user.toString() === resolvedUserId
  );

  if (alreadyMember) {
    throw new AppError(
      "User is already a project member",
      HTTP_STATUS.BAD_REQUEST
    );
  }

  // Enforce single PO
  if (role === ProjectRole.PO) {
    const existingPO = project.members.find(
      (m) => m.role === ProjectRole.PO
    );

    if (existingPO) {
      throw new AppError(
        "Project already has a Product Owner",
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  // Enforce single PM
  if (role === ProjectRole.PM) {
    const existingPM = project.members.find(
      (m) => m.role === ProjectRole.PM
    );

    if (existingPM) {
      throw new AppError(
        "Project already has a Project Manager",
        HTTP_STATUS.BAD_REQUEST
      );
    }
  }

  project.members.push({
    user: user._id,
    role,
  });

  await project.save();

  return project;
};

interface GetProjectByIdArgs {
  projectId: string;
  requesterId: string;
  requesterRole: GlobalRole;
}

export const getProjectByIdService = async ({
  projectId,
  requesterId,
  requesterRole,
}: GetProjectByIdArgs) => {
  const project = await Project.findById(projectId)
    .populate("createdBy", "name email")
    .populate("members.user", "name email role");

  if (!project) {
    throw new AppError("Project not found", HTTP_STATUS.NOT_FOUND);
  }

  // Admin can access any project
  if (requesterRole === GlobalRole.ADMIN) {
    return project;
  }

  // Otherwise must be member
  const isMember = project.members.find(
    (m) => m.user._id.toString() === requesterId
  );

  if (!isMember) {
    throw new AppError(
      "You are not authorized to view this project",
      HTTP_STATUS.FORBIDDEN
    );
  }

  return project;
};