import { Router } from "express";
import {
  createContactValidator,
  deleteContactValidator,
  updateContactValidator,
} from "../../validators/contactValidator";
import {
  createContact,
  deleteContact,
  getAllContacts,
  updateContact,
} from "./contactController";
import { isLoggedIn } from "../../middleware/authMiddleware";

export const contactRoutes: Router = Router();

contactRoutes
  .route("/")
  .post(createContactValidator, createContact) //isLoggedIn,
  .get(getAllContacts);

contactRoutes
  .route("/:contactId")
  .delete(deleteContactValidator, deleteContact)
  .patch(updateContactValidator, updateContact);
