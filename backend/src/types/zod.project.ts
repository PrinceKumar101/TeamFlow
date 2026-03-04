import * as z from 'zod';
import { ProjectRole } from './role.type.js';

export const createProjectZodSchema = z.object({
  name: z
    .string()
    .min(3, 'Project name must be at least 3 characters')
    .max(100, 'Project name cannot exceed 100 characters')
    .trim(),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
  adminId: z.string().optional(),
});

// Body-only schema (no projectId) — used by the route validator
export const addProjectMemberBodySchema = z
  .object({
    userId: z.string().min(1).optional(),
    email: z.string().email('Invalid email address').optional(),
    role: z.enum(ProjectRole),
  })
  .refine((data) => data.userId || data.email, {
    message: 'Either userId or email is required',
    path: ['email'],
  });

export type CreateProjectInput = z.infer<typeof createProjectZodSchema>;
export type AddProjectMemberBody = z.infer<typeof addProjectMemberBodySchema>;
export type AddProjectMemberInput = AddProjectMemberBody & { projectId: string };
