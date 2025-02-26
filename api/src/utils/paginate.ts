import { Request } from "express";
import { IContact } from "../feature/contact/contactInterface";
import { getContactsState } from "../services/socketService";
import { IPagination } from "./interfaces/paginationInterface";
interface PaginatedContacts {
  pagination: IPagination;
  contacts: IContact[];
}

const parseQueryParams = (req?: Request): { page: number; limit: number; search: string } => {
  const page = Number(req?.query.page) || 1;
  const limit = Number(req?.query.limit) || 5;
  const search = String(req?.query.search || '').toLowerCase();
  return { page, limit, search };
};

const filterContacts = (contacts: IContact[], search: string): IContact[] => {
  if (!search) return contacts;
  return contacts.filter(contact =>
    contact.name.toLowerCase().includes(search) ||
    contact.email.toLowerCase().includes(search) ||
    (contact.address?.country?.toLowerCase().includes(search) ?? false) ||
    (contact.address?.city?.toLowerCase().includes(search) ?? false) ||
    (contact.address?.street?.toLowerCase().includes(search) ?? false) ||
    contact.phone.includes(search)
  );
};

const calculatePagination = (total: number, page: number, limit: number): IPagination => {
  const totalPages = Math.ceil(total / limit);
  const skip = (page - 1) * limit;
  return {
    currentPage: page,
    totalDocuments: total,
    totalPages,
    limit,
    skip,
    nextPage: page + 1 > totalPages ? 0 : page + 1,
    prevPage: page - 1 < 1 ? 0 : page - 1,
  };
};

export const paginate = (req?: Request): PaginatedContacts => {
  const { page, limit, search } = parseQueryParams(req);
  const allContacts = Object.values(getContactsState().contacts);
  const filteredContacts = filterContacts(allContacts, search);
  const pagination = calculatePagination(filteredContacts.length, page, limit);
  const paginatedContacts = filteredContacts.slice(pagination.skip, pagination.skip + limit);

  return {
    pagination,
    contacts: paginatedContacts,
  };
};