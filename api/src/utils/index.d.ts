import { IUser } from "../feature/user/userInterface";

declare module 'express' {
    interface Request {
      user?: IUser;
    }
  }