import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { IContact, IContactWithLock, IContactsState } from "../feature/contact/contactInterface";
import { getAllLocks, getLock } from "./contactService";
import contactModel from "../feature/contact/contactModel";
import { Features } from "../utils/features";

let io: Server;
let contactsState: IContactsState = { contacts: {} };

export const SOCKET_EVENTS = {
  CONTACTS_STATE: "contacts:state"
};

const cleanContact = (contact: any): IContact => {
  const { _id, name, email, phone, notes } = contact;
  return { _id, name, email, phone, notes };
};

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: { 
      origin: "*",
      methods: ["GET", "POST"]
    },
    path: "/socket.io/",
    serveClient: false
  });

  io.on("connection", async(socket) => {
    // Set initial contacts, if no contacts are present
    if (Object.keys(contactsState.contacts).length === 0){ 
      const count = await contactModel.countDocuments();
      const { query } = new Features(
        contactModel.find(),
        { page: 1, limit: 10 }
      ).paginate(count);
      
      const contacts = await query;
      setInitialContacts(contacts.map(cleanContact));
    }
    socket.emit(SOCKET_EVENTS.CONTACTS_STATE, contactsState);
  });

  return io;
};

const emitState = () => {
  io?.emit(SOCKET_EVENTS.CONTACTS_STATE, contactsState);
};

export const updateContactState = (contact: IContact) => {
  contactsState.contacts[contact._id] = {
    ...cleanContact(contact),
    lock: getLock(contact._id)
  };
  emitState();
};

export const deleteContactFromState = (contactId: string) => {
  delete contactsState.contacts[contactId];
  emitState();
};

export const updateContactLock = (contactId: string) => {
  if (contactsState.contacts[contactId]) {
    contactsState.contacts[contactId].lock = getLock(contactId);
    emitState();
  }
};

export const setInitialContacts = (contacts: IContact[]) => {
  const locks = getAllLocks();
  contactsState.contacts = contacts.reduce((acc, contact) => {
    acc[contact._id] = {
      ...cleanContact(contact),
      lock: locks.get(contact._id) || null
    };
    return acc;
  }, {} as { [id: string]: IContactWithLock });
  emitState();
};
