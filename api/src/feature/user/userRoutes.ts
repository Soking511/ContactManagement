import { Router } from "express";
import { login, register } from "./userController";

export const userRoutes: Router = Router();

userRoutes.post("/register", register);
userRoutes.post("/login", login);
