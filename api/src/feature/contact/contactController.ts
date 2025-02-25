import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import contactModel from "./contactModel";
import { Features } from "../../utils/features";
import { releaseLock } from "../../services/contactService";
import { updateContactState } from "../../services/socketService";

export const createContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, phone, notes } = req.body;
    const existingContact = await contactModel.findOne({ email });
    if (existingContact) {
      res.status(400).json({ message: "Contact already exists" });
      throw new Error("Contact already exists");
    }

    const contact = await contactModel.create({ name, email, phone, notes });
    updateContactState(contact);

    res.status(201).json(contact);
  }
);

export const deleteContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { contactId } = req.params;
    const contact = await contactModel.findByIdAndDelete(contactId);

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }

    res.status(200).json(contact);
  }
);

export const updateContact = asyncHandler(
  async (req: Request, res: Response) => {
    const { contactId } = req.params;
    const { name, email, phone, notes } = req.body;
    const contact = await contactModel.findByIdAndUpdate(
      contactId,
      { name, email, phone, notes },
      { new: true }
    );

    if (!contact) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    releaseLock(contactId, req.user!._id);
    updateContactState(contact);
    res.status(200).json(contact);
  }
);

export const getAllContacts = asyncHandler(
  async (req: Request, res: Response) => {
    const count = await contactModel.countDocuments();
    const { pagination, query } = new Features(
      contactModel.find(),
      req.query
    ).paginate(count);

    const data = await query;
    res.json({
      data,
      pagination,
    });
  }
);
