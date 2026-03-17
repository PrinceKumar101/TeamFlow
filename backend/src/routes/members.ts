import express from 'express';
import {
  authorizeGlobal,
  authorizeProjectRole,
  protect,
  validate,
} from '../middlewares/auth.js';
import { GlobalRole, ProjectRole } from '../types/role.type.js';
import {
  addMemberController,
  getAllMemberController,
} from '../controller/members.controller.js';
import { addMemberBodySchema } from '../types/zod.member.js';
import { asyncHandler } from '../utils/utilityFunctions.js';

const router = express.Router({ mergeParams: true });

router.get(
  '/',
  protect,
  authorizeGlobal([GlobalRole.ADMIN]),
  authorizeProjectRole([ProjectRole.PO, ProjectRole.PM]),
  asyncHandler(getAllMemberController),
);

router.post(
  '/',
  protect,
  validate(addMemberBodySchema),
  authorizeGlobal([GlobalRole.ADMIN]),
  authorizeProjectRole([ProjectRole.PO, ProjectRole.PM]),
  asyncHandler(addMemberController),
);

export { router as membersRoute };
