import {
  IContact,
  IContactWithLock,
  IContactsState,
} from "../feature/contact/contactInterface";
import { Server as HttpServer } from "http";
import { paginate } from "../utils/paginate";
import {
  acquireLock,
  getLock,
  getUserLocks,
  releaseLock,
} from "./contactService";
import { Server } from "socket.io";

let io: Server;
let contactsState: IContactsState = { contacts: {} };

export const SOCKET_EVENTS = {
  CONTACT_UPDATED: "contact:updated",
  CONTACT_DELETED: "contact:deleted",
  CONTACT_CREATED: "contact:created",
  CONTACT_LOCKED: "contact:locked",
  CONTACT_UNLOCKED: "contact:unlocked",
  CONTACT_LOCK_STATE: "contact:lockState",
};

export const cleanContact = (contact: any): IContact => {
  const { _id, name, email, phone, notes, address } = contact;
  return { _id, name, email, phone, notes, address };
};

export const getContactsState = () => contactsState;

export const initializeSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      getUserLocks(socket.id).forEach((lock) => {
        io?.emit(SOCKET_EVENTS.CONTACT_UNLOCKED, lock);
        console.log(`Unlocking contact ${lock.contactId}`);
      });
    });

    socket.on(
      SOCKET_EVENTS.CONTACT_LOCKED,
      (contactId: string, userId: string) => {
        console.log(`Locking contact ${contactId} for user ${userId}`);
        acquireLock(contactId, userId);
      }
    );

    socket.on(
      SOCKET_EVENTS.CONTACT_UNLOCKED,
      (contactId: string, userId: string) => {
        console.log(`Unlocking contact ${contactId} for user ${userId}`);
        releaseLock(contactId, userId);
      }
    );
  });

  return io;
};

export const createContactState = (contact: IContact) => {
  const lock = getLock(contact._id);
  contactsState.contacts[contact._id] = { ...contact, lock };
  io?.emit(
    SOCKET_EVENTS.CONTACT_CREATED,
    { ...contact, lock },
    paginate().pagination
  );
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
  delete contactsState.contacts[contactId];
  io?.emit(SOCKET_EVENTS.CONTACT_DELETED, contactId, paginate().pagination);
};

export const updateContactLock = (contactId: string) => {
  const lock = getLock(contactId);
  if (!lock) return;

  contactsState.contacts[contactId].lock = lock;
  io?.emit(SOCKET_EVENTS.CONTACT_LOCK_STATE, lock);
};

export const setInitialContacts = (contacts: IContact[]) => {
  contactsState.contacts = contacts.reduce((acc, contact) => {
    acc[contact._id] = {
      ...contact,
      lock: getLock(contact._id),
    };
    return acc;
  }, {} as { [id: string]: IContactWithLock });
};

export const deleteContactUnlock = (contactId: string) => {
  if (contactsState.contacts[contactId]) {
    contactsState.contacts[contactId].lock = null;
    io?.emit(SOCKET_EVENTS.CONTACT_UPDATED, {
      ...contactsState.contacts[contactId],
      lock: null,
    });
  }
};
