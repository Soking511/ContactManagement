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

export const getContacts = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 5;
  const skip = (page - 1) * limit;

  const contacts = Object.values(getContactsState().contacts);
  const totalContacts = contacts.length;
  const totalPages = Math.ceil(totalContacts / limit);

  const paginatedContacts = contacts.slice(skip, skip + limit);

  res.json({
    data: paginatedContacts,
    pagination: {
      currentPage: page,
      limit,
      totalPages,
      totalDocuments: totalContacts,
      nextPage: page + 1 > totalPages ? page : page + 1,
      prevPage: page - 1 < 1 ? page : page - 1,
    },
  });
});

export const createContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, notes, address } = req.body;
    const existingContact = await contactModel.findOne({ name });
    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      return;
    }

    const contact = await contactModel.create({
      name,
      email,
      phone,
      notes,
      address: {
        street: address.street,
        city: address.city,
        country: address.country,
      },
    });

    const savedContact = await contactModel.findById(contact._id).lean();
    createContactState(savedContact as IContact);
    res.status(201).json(savedContact);
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
