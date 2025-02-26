import { Router } from "express";
import {
  createContactValidator,
  updateContactValidator,
} from "../../validators/contactValidator";
import {
  createContact,
  deleteContact,
  getContacts,
  updateContact,
} from "./contactController";
import { isLoggedIn } from "../../middleware/authMiddleware";

export const contactRoutes: Router = Router();

contactRoutes
  .route("/")
  .post(isLoggedIn, createContactValidator, createContact) //isLoggedIn,
  .get(isLoggedIn, getContacts);

contactRoutes
  .route("/:contactId")
  .delete(isLoggedIn, deleteContact)
  .put(isLoggedIn, updateContactValidator, updateContact);
