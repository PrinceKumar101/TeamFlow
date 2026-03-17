import * as z from 'zod';
import { ProjectRole } from './role.type.js';

export const addMemberBodySchema = z.object({
  userId: z.string('User id must be string').trim(),
  role: z.enum(ProjectRole),
});

export type addMemberType = z.infer<typeof addMemberBodySchema>;
