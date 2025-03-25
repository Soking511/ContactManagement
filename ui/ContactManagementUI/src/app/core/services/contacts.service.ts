import { Injectable, signal } from '@angular/core';
import { IPagination } from '../interfaces/paginationInterface';
import { io, Socket } from 'socket.io-client';
import { ApiService } from './api.service';
import { IContact, IContactWithLock, ILock } from '../interfaces/contactInterface';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

interface SortConfig {
  column: keyof IContact;
  direction: 'asc' | 'desc';
}

@Injectable({
  providedIn: 'root',
})


export class ContactsService {
  socket: Socket;
  contacts = signal<IContactWithLock[]>([]);
  pagination: IPagination | null = null;
  isUserIdle = signal<boolean>(false);
  selectedContact = signal<IContactWithLock | null>(null);
  private currentSort = signal<SortConfig>({ column: 'name', direction: 'asc' });

  constructor(private apiService: ApiService, private authService: AuthService) {

    this.socket = io(environment.baseURL, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupSocketListeners();
    this.setupIdleListener();
    this.getContacts();

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);

      setTimeout(() => {
        console.log('Attempting to reconnect...');
        this.socket.connect();
      }, 2000);
    });
  }

  private updatePagination = (pagination: IPagination) => {
    this.pagination = {
      ...pagination,
      currentPage:
        (this.pagination!.currentPage > pagination.totalPages)
          ? pagination.totalPages
          : this.pagination!.currentPage,
    };
  };


  private setupSocketListeners() {
    this.socket.on('connection', () => {
    //   console.log('Socket connected');

    });

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

    this.socket.on('contact:deleted', (contactId: string, pagination: IPagination) => {
      const currentContacts = this.contacts();
      this.contacts.set(currentContacts.filter((c) => c._id !== contactId));
      this.updatePagination(pagination);
      this.getContacts(this.pagination!.currentPage);
    });

    this.socket.on('contact:lockState', (lock: ILock) => {
      console.log(`Contact ${lock.contactId} locked by user ${lock.userId}: `);
      const currentContacts = this.contacts() as IContactWithLock[];
      const index = currentContacts.findIndex((c) => c._id === lock.contactId);
      if (index !== -1) {
        currentContacts[index].lock = lock;
        this.contacts.set([...currentContacts]);
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }

  getContacts(page: number = 1, search?: string): void {
    this.apiService.get('/contacts', page, true, `search=${search||''}`).subscribe({
      next: (response: any) => {
        this.contacts.set(response.data);
        this.pagination = response.pagination;
        this.authService.user.set(response.currentUser);
      },
    });
  }

  createContact(contact: Partial<IContact>): void {
    this.apiService.post('/contacts', contact).subscribe();
  }

  updateContact(contactId: string, contact: Partial<IContact>): void {
    this.apiService.put(`/contacts/${contactId}`, contact).subscribe();
  }

  deleteContact(contactId: string): void {
    this.apiService.delete(`/contacts/${contactId}`).subscribe();
  }

  async disconnect(): Promise<void> {
    if (this.socket) {
      await this.socket.emit('contact:unlocked', this.selectedContact()?._id, this.authService.user()?._id);
      await this.socket.disconnect();
    }
  }

  sortContacts(column: keyof IContact) {
    const currentSort = this.currentSort();
    if (currentSort.column === column) {
      this.currentSort.update(sort => ({
        ...sort,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      }));
    } else {
      this.currentSort.set({ column, direction: 'asc' });
    }

    const sortedContacts = [...this.contacts()].sort((a, b) => {
      const aValue = a[column];
      const bValue = b[column];

      if (aValue === bValue) return 0;

      const compareResult = aValue! < bValue! ? -1 : 1;
      return this.currentSort().direction === 'asc'
        ? compareResult
        : -compareResult;
    });

    this.contacts.set(sortedContacts);
  }

  getCurrentSort = () => this.currentSort();

  private setupIdleListener() {
    window.addEventListener('userIdle', ((event: CustomEvent) => {
      if (event.detail) {
        this.disconnect();
        this.isUserIdle.set(true);

      }
    }) as EventListener);
  }
}
