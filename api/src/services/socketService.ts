import { IContact, IContactWithLock, IContactsState } from "../feature/contact/contactInterface";
import { getLock } from "./contactService";
import { Server as HttpServer } from "http";
import { Server } from "socket.io";
import contactModel from "../feature/contact/contactModel";

let io: Server;
let contactsState: IContactsState = { contacts: {} };

export const SOCKET_EVENTS = {
  CONTACT_UPDATED: "contact:updated",
  CONTACT_DELETED: "contact:deleted",
  CONTACT_CREATED: "contact:created",
  CONTACT_LOCKED: "contact:locked", 
  CONTACT_UNLOCKED: "contact:unlocked"
};

const cleanContact = (contact: any): IContact => {
  const { _id, name, email, phone, notes, address } = contact;
  return { _id, name, email, phone, notes, address };
};

export const getContactsState = () => contactsState;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { 
      origin: "http://localhost:4200",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/socket.io/",
    serveClient: false
  });

  io.on("connection", async() => {
    if (Object.keys(contactsState.contacts).length === 0){ 
      const contacts = await contactModel.find();
      setInitialContacts(contacts.map(cleanContact));
    }
  });

  return io;
};

export const createContactState = (contact: IContact) => {
  const lock = getLock(contact._id);
  contactsState.contacts[contact._id] = { ...contact, lock };
  io?.emit(SOCKET_EVENTS.CONTACT_CREATED, { ...contact, lock });
};

export const updateContactState = (contact: IContact) => {
  const lock = getLock(contact._id);
  const isNewContact = !contactsState.contacts[contact._id];
  contactsState.contacts[contact._id] = { ...contact, lock };
  
  if (isNewContact) {
    io?.emit(SOCKET_EVENTS.CONTACT_CREATED, { ...contact, lock });
  } else {
    io?.emit(SOCKET_EVENTS.CONTACT_UPDATED, { ...contact, lock });
  }
};

export const deleteContactState = (contactId: string) => {
  const deletedContact = contactsState.contacts[contactId];
  delete contactsState.contacts[contactId];
  io?.emit(SOCKET_EVENTS.CONTACT_DELETED, { contactId, deletedContact });
};

export const updateContactLock = (contactId: string) => {
  if (contactsState.contacts[contactId]) {
    const lock = getLock(contactId);
    contactsState.contacts[contactId].lock = lock;
    io?.emit(SOCKET_EVENTS.CONTACT_LOCKED, { contactId, lock });
  }
};

export const setInitialContacts = (contacts: IContact[]) => {
  contactsState.contacts = contacts.reduce((acc, contact) => {
    acc[contact._id] = {
      ...contact,
      lock: getLock(contact._id)
    };
    return acc;
  }, {} as { [id: string]: IContactWithLock });
};
