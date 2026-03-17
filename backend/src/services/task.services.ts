import { AppError } from '../utils/utilityFunctions.js';
import { HTTP_STATUS } from '../utils/httpStatusCode.js';
import { createTaskType } from '../types/zod.task.js';
import Project from '../models/project.model.js';
import { GlobalRole, ProjectRole } from '../types/role.type.js';
import Task, { TaskStatus } from '../models/task.model.js';
type CreateTaskArgs = createTaskType & {
  projectId: string;
  createdBy: string;
};

export const createTaskService = async ({
  projectId,
  title,
  description,
  assignedTo,
  priority,
  dueDate,
  parentTaskId,
  createdBy,
}: CreateTaskArgs) => {
  const project = await Project.findById(projectId);

  if (!project) {
    throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
  }

  if (project.status === 'ARCHIVED') {
    throw new AppError(
      'Cannot create task in archived project',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  // Validate assigned developer
  const assignedMember = project.members.find(
    (m) => m.user.toString() === assignedTo,
  );

  if (!assignedMember) {
    throw new AppError(
      'Assigned user is not part of this project',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  if (assignedMember.role !== ProjectRole.DEVELOPER) {
    throw new AppError(
      'Task can only be assigned to a developer',
      HTTP_STATUS.BAD_REQUEST,
    );
  }

  // 🔥 Subtask Validation
  if (parentTaskId) {
    const parentTask = await Task.findById(parentTaskId);

    if (!parentTask) {
      throw new AppError('Parent task not found', HTTP_STATUS.NOT_FOUND);
    }

    if (parentTask.projectId.toString() !== projectId) {
      throw new AppError(
        'Parent task does not belong to this project',
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    // Prevent multi-level nesting
    if (parentTask.parentTaskId) {
      throw new AppError(
        'Nested subtasks beyond one level are not allowed',
        HTTP_STATUS.BAD_REQUEST,
      );
    }
  }

  const newTask = new Task({
    title,
    description,
    projectId,
    createdBy,
    assignedTo,
    priority,
    dueDate,
    parentTaskId: parentTaskId || null,
    status: TaskStatus.TODO,
  });
  const savedNewTask = await newTask.save();
  if (!savedNewTask)
    throw new AppError(
      'Error creating task',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
    );
  return savedNewTask;
};

interface UpdateTaskStatusArgs {
  taskId: string;
  requesterId: string;
  requesterRole: string;
  newStatus: TaskStatus;
}

export const updateTaskStatusService = async ({
  taskId,
  requesterId,
  requesterRole,
  newStatus,
}: UpdateTaskStatusArgs) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found', HTTP_STATUS.NOT_FOUND);
  }

  const project = await Project.findById(task.projectId);

  if (!project) {
    throw new AppError('Project not found', HTTP_STATUS.NOT_FOUND);
  }

  // Global ADMIN can update any task — they are not in the members array
  if (requesterRole !== GlobalRole.ADMIN) {
    const member = project.members.find((m) => m.user.toString() === requesterId);

    if (!member) {
      throw new AppError('Not a project member', HTTP_STATUS.FORBIDDEN);
    }

    if (member.role === ProjectRole.DEVELOPER) {
      // Developers can only update tasks assigned to them
      if (task.assignedTo.toString() !== requesterId) {
        throw new AppError(
          'Developers can update only their assigned tasks',
          HTTP_STATUS.FORBIDDEN,
        );
      }
    }
  }

  // ADMIN, PO and PM are allowed for any task

  task.status = newStatus;
  await task.save();

  // If parent task marked DONE → auto-mark all subtasks DONE
  if (newStatus === TaskStatus.DONE && !task.parentTaskId) {
    await Task.updateMany(
      { parentTaskId: task._id, status: { $ne: TaskStatus.DONE } },
      { $set: { status: TaskStatus.DONE } },
    );
  }

  return task;
};

export const getTasksByProjectService = async (projectId: string) => {
  const tasks = await Task.find({ projectId })
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!tasks) throw new AppError('task not found', HTTP_STATUS.NOT_FOUND);
  return tasks;
};

export const getSingleTaskService = async (taskId: string) => {
  const task = await Task.findById(taskId)
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email');

  if (!task) {
    throw new AppError('Task not found', HTTP_STATUS.NOT_FOUND);
  }

  return task;
};

export const deleteTaskService = async (taskId: string) => {
  const task = await Task.findById(taskId);

  if (!task) {
    throw new AppError('Task not found', HTTP_STATUS.NOT_FOUND);
  }

  // Also delete all subtasks if this is a parent task
  await Task.deleteMany({ parentTaskId: taskId });
  await Task.deleteOne({ _id: taskId });
};
