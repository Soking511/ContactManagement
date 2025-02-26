import { Express } from "express";
import { contactRoutes } from "../feature/contact/contactRoutes";
import { userRoutes } from "../feature/user/userRoutes";

export const mountRoutes = (app: Express) => {
  app.use("/api/contacts", contactRoutes);
  app.use("/api/users", userRoutes);
};