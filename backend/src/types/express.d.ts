import 'express-serve-static-core';
import { GlobalRole } from './role.type.js';

declare module 'express-serve-static-core' {
  interface Request {
    validatedData?: unknown;
    userId?: string;
    userRole?: GlobalRole;
  }
}
export {};
