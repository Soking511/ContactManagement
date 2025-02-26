import { Injectable, signal } from '@angular/core';
import { IPagination } from '../interfaces/paginationInterface';
import { io, Socket } from 'socket.io-client';
import { ApiService } from './api.service';
import { IContact } from '../interfaces/contactInterface';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private socket: Socket;
  contacts = signal<IContact[]>([]);
  pagination: IPagination | null = null;
  isUserIdle = signal<boolean>(false);

  constructor(private apiService: ApiService) {
    this.socket = io('http://localhost:3000', {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    this.setupSocketListeners();
    this.setupIdleListener();
    this.getContacts();
  }

  private updatePagination = (pagination: IPagination) => {
    this.pagination = {
      ...pagination,
      currentPage: this.pagination!.currentPage,
    };
  };
  

  private setupSocketListeners() {
    // this.socket.on('connection', () => {
    //   console.log('Socket connected');
      
    // });

    // Events for updating the UI
    this.socket.on('contact:created', (contact: IContact, pagination: IPagination) => {
      const currentContacts = this.contacts();
      if (this.pagination?.limit! > currentContacts.length) {
        this.contacts.set([...currentContacts, contact]);
      }
      this.updatePagination(pagination);
    });

    this.socket.on('contact:updated', (updatedContact: IContact) => {
      const currentContacts = this.contacts();
      const index = currentContacts.findIndex(
        (c) => c._id === updatedContact._id
      );
      if (index !== -1) {
        currentContacts[index] = updatedContact;
        this.contacts.set([...currentContacts]);
      }
    });

    this.socket.on('contact:deleted', (contactId: string) => {
      const currentContacts = this.contacts();
      this.contacts.set(currentContacts.filter((c) => c._id !== contactId));
      this.getContacts(this.pagination!.currentPage);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  getContacts(page: number = 1): void {
    this.apiService.get('/contacts', page, true).subscribe({
      next: (response: any) => {
        this.contacts.set(response.data);
        this.pagination = response.pagination;
      },
    });
  }

  createContact(contact: Partial<IContact>): void {
    this.apiService.post('/contacts', contact).subscribe();
  }

  updateContact(contactId: string, contact: Partial<IContact>): void {
    this.socket.emit('contacts:update', { contactId, ...contact });
  }

  deleteContact(contactId: string): void {
    this.apiService.delete(`/contacts/${contactId}`).subscribe();
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  private setupIdleListener() {
    window.addEventListener('userIdle', ((event: CustomEvent) => {
      if (event.detail) {
        this.disconnect();
        this.isUserIdle.set(true);
        console.log('Disconnected due to idle state');
      }
    }) as EventListener);
  }
}
