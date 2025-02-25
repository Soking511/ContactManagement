import { Application } from "express";
import { contactRoutes } from "../feature/contact/contactRoutes";

export const mountRoutes = (app: Application) => {
    app.use('/api/contacts', contactRoutes); 
}