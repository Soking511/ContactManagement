export interface IContact {
    _id: string;
    name: string;
    email: string;
    phone: string;
    notes?: INote[];   
}

export interface INote {
    message: string;
}

export interface ILock {
    userId: string;
    contactId: string;
    timestamp: number;
}

export interface IContactWithLock extends IContact {
    lock: ILock | null;
}

export interface IContactsState {
    contacts: { [id: string]: IContactWithLock };
}
