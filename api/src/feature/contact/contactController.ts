import {
  createContactState,
  deleteContactState,
  updateContactState,
  getContactsState,
} from "../../services/socketService";
import { Request, Response } from "express";
import { releaseLock } from "../../services/contactService";
import { IContact } from "./contactInterface";
import asyncHandler from "express-async-handler";
import contactModel from "./contactModel";
import { paginate } from "../../utils/paginate";

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const [pagination, contacts] = paginate(req);
  res.json({
    data: contacts,
    pagination,
  });
});

export const createContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, notes, address } = req.body;

    if (!name || !email || !phone) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    // search in contacts state, that is faster than database 
    const contacts = Object.values(getContactsState().contacts);
    const existingContact = contacts.find(contact => contact.email === email);
    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      return;
    }

    const contact = await contactModel.create(
      {
        name,
        email,
        phone,
        notes,
        address: {
          street: address.street,
          city: address.city,
          country: address.country,
        },
      }
    ).then(doc => doc.toObject());
    // convert mongoose document to plain object
 
    createContactState(contact);
    res.status(201).json(contact);
  }
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone, notes, address } = req.body;

    const contact = await contactModel
      .findByIdAndUpdate(
        id,
        {
          name,
          email,
          phone,
          notes,
          address: {
            street: address.street,
            city: address.city,
            country: address.country,
          },
        },
        { new: true }
      )
      .lean();

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    releaseLock(id, req.user!._id);
    updateContactState(contact as IContact);
    res.json(contact);
  }
);

export const deleteContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { contactId } = req.params;
    const contact = await contactModel.findByIdAndDelete(contactId).lean();

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    deleteContactState(contact._id);
    res.json({ message: "Contact deleted" });
  }
);
