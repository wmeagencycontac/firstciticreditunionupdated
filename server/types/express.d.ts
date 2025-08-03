import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        email_verified: boolean;
        role: string;
      };
    }
  }
}
