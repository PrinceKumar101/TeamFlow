import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    validatedData?: unknown;
    userId?: ObjectId;
    userRole?: GlobalRole;
  }
}
export {};
