import { Request } from "express";
import { IContact } from "../feature/contact/contactInterface";
import { getContactsState } from "../services/socketService";
import { IPagination } from "./interfaces/paginationInterface";

export const paginate = (
  req?: Request
): [IPagination, IContact[]] => {
  const page = Number(req?.query.page) || 1;
  const limit = Number(req?.query.limit) || 5;
  const skip = (page - 1) * limit;

  const contacts = Object.values(getContactsState().contacts);
  const totalContacts = contacts.length;
  const totalPages = Math.ceil(totalContacts / limit);

  return [
    {
      currentPage: page,
      totalDocuments: totalContacts,
      totalPages,
      limit,
      skip,
      nextPage: page + 1 > totalPages ? 0 : page + 1,
      prevPage: page - 1 < 1 ? 0 : page - 1,
    },
    contacts.slice(skip, skip + limit)
  ];
};
