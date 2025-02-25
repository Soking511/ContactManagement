import { ILock } from "../feature/contact/contactInterface";

const locks = new Map<string, ILock>();
const LOCK_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const acquireLock = (contactId: string, userId: string): boolean => {
  const existingLock = locks.get(contactId);

  if (existingLock) {
    const isExpired = Date.now() - existingLock.timestamp > LOCK_TIMEOUT;
    // if seem user and not expired
    if (existingLock.userId === userId && !isExpired) {
      return false;
    }
    // if not expired but not seem user
    else if (!isExpired) {
      return false;
    }
    // if expired
    else {
      locks.delete(contactId);
    }
  }

  locks.set(contactId, { userId, contactId, timestamp: Date.now() });
  return true;
};

export const releaseLock = (contactId: string, userId: string): boolean => {
  const lock = locks.get(contactId);
  if (lock && lock.userId === userId) {
    locks.delete(contactId);
    return true;
  }
  return false;
};

export const isLocked = (contactId: string, userId: string): boolean => {
  const lock = locks.get(contactId);
  if (!lock) return false;

  const isExpired = Date.now() - lock.timestamp > LOCK_TIMEOUT;
  if (isExpired) {
    locks.delete(contactId);
    return false;
  }

  return lock.userId !== userId;
};

export const getAllLocks = (): Map<string, ILock> => {
  // Clean expired locks before returning
  locks.forEach((lock, contactId) => {
    if (Date.now() - lock.timestamp > LOCK_TIMEOUT) {
      locks.delete(contactId);
    }
  });
  return locks;
};

export const getLock = (contactId: string): ILock | null => {
  const lock = locks.get(contactId);
  if (!lock) return null;

  const isExpired = Date.now() - lock.timestamp > LOCK_TIMEOUT;
  if (isExpired) {
    locks.delete(contactId);
    return null;
  }

  return lock;
};

setTimeout(() => {
  locks.forEach((lock, contactId) => {
    if (Date.now() - lock.timestamp > LOCK_TIMEOUT) {
      locks.delete(contactId);
    }
  });
}, 1000 * 60 * 5);
