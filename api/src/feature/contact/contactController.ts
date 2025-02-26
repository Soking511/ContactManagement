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
    currentUser: req.user,
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
    const { contactId } = req.params;
    const updateData: any = {};

    // Only include fields that are present in the request body
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.email) updateData.email = req.body.email;
    if (req.body.phone) updateData.phone = req.body.phone;
    if (req.body.notes) updateData.notes = req.body.notes;
    
    // Handle address updates only if address fields are provided
    if (req.body.address) {
      updateData.address = {};
      if (req.body.address.street) updateData.address.street = req.body.address.street;
      if (req.body.address.city) updateData.address.city = req.body.address.city;
      if (req.body.address.country) updateData.address.country = req.body.address.country;
    }

    const contact = await contactModel
      .findOneAndUpdate(
        { _id: contactId },
        updateData,
        { new: true }
      )
      .lean();

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    releaseLock(contactId, req.user!._id);
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
