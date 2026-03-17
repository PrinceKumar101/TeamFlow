import * as z from 'zod';
import { TaskPriority, TaskStatus } from '../models/task.model.js';

const baseTaskFields = {
  title: z.string().min(3).max(200).trim(),
  description: z.string().max(1000).trim().optional(),
  priority: z.enum(TaskPriority).default(TaskPriority.MEDIUM),
  dueDate: z.string().optional(),
};

export const createTaskZodSchema = z.object({
  ...baseTaskFields,
  assignedTo: z.string().min(1),
  parentTaskId: z.string().optional(),
});

export const updateTaskStatusZodSchema = z.object({
  status: z.enum(TaskStatus),
});

export const updateTaskDetailsZodSchema = z.object({
  title: baseTaskFields.title.optional(),
  description: baseTaskFields.description,
  priority: baseTaskFields.priority.optional(),
  dueDate: baseTaskFields.dueDate,
});

export type createTaskType = z.infer<typeof createTaskZodSchema>;
export type updateTaskStatusType = z.infer<typeof updateTaskStatusZodSchema>;
