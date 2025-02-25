import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";

export const isLoggedIn = () => {
    return asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return next(new Error('unauthorized!'));
      }
      next();
    });
  };