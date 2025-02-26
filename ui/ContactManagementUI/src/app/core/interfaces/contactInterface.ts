export interface IContact {
    _id?: string;
    name: string;
    email: string;
    phone: string;
    notes?: string;   
    address?: IAddress;
}

export interface IAddress{
    street: string;
    city: string;
    country: string;
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


