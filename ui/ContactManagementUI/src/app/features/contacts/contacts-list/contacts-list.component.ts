import { Component, inject, OnDestroy, signal } from '@angular/core';
import { SessionTimeoutComponent } from '../../session-timeout/session-timeout.component';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ContactsService } from '../../../core/services/contacts.service';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { PopupComponent } from '../../../shared/components/popup/popup.component';
import { CommonModule } from '@angular/common';
import { IContact } from '../../../core/interfaces/contactInterface';
import { ContactsElementComponent } from "../contacts-element/contacts-element.component";

type SortableColumns = keyof Omit<IContact, '_id'>;

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    SessionTimeoutComponent,
    ContactsFormComponent,
    PaginationComponent,
    ReactiveFormsModule,
    ButtonComponent,
    PopupComponent,
    CommonModule,
    ContactsElementComponent
],
  templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent implements OnDestroy {
  selectedContact = signal<IContact | null>(null);
  contactsService = inject(ContactsService);
  tableHeaders = [
    { key: 'name' as SortableColumns, label: 'Name' },
    { key: 'email' as SortableColumns, label: 'Email' },
    { key: 'phone' as SortableColumns, label: 'Phone' },
    { key: 'address.country + address.city' as SortableColumns, label: 'Address' },
    { key: 'notes' as SortableColumns, label: 'Notes' }
  ];
  contacts;
  
  toggles = {
    create: false,
    delete: false,
  };

  constructor() {
    this.contacts = this.contactsService.contacts;
  }
  
  sortBy(column: SortableColumns) {
    this.contactsService.sortContacts(column);
  }

  isCurrentSortColumn = (column: keyof IContact): boolean =>
    this.contactsService.getCurrentSort().column === column;
  
  getSortIcon = (): string =>
    this.contactsService.getCurrentSort().direction === 'asc' ? 'arrow_upward': 'arrow_downward';

  onSearchChange(searchInput: string) {
    this.contactsService.getContacts(1, searchInput);
  }

  deleteContact(id: string): void {
    this.contactsService.deleteContact(id);
  }

  updateContact(event: {field: any, value: string}) {
    const contact = this.selectedContact();
    console.log(contact)
    if (!contact) return;

    if (event.field.startsWith('address')) {
      // Handle address fields
      if (!contact.address) contact.address = { country: '', city: '', street: '' };
      
      switch(event.field) {
        case 'addressCountry':
          contact.address.country = event.value;
          this.contactsService.updateContact(contact._id!, { 
            address: { ...contact.address, country: event.value } 
          });
          break;
        case 'addressCity':
          contact.address.city = event.value;
          this.contactsService.updateContact(contact._id!, { 
            address: { ...contact.address, city: event.value } 
          });
          break;
        case 'addressStreet':
          contact.address.street = event.value;
          this.contactsService.updateContact(contact._id!, { 
            address: { ...contact.address, street: event.value } 
          });
          break;
      }
    } else {
      // Handle direct fields
      const field = event.field as keyof IContact;
      contact[field] = event.value as any;
      this.contactsService.updateContact(contact._id!, { [field]: event.value });
    }
  }

  onPageChange(page: number) {
    this.contactsService.getContacts(page);
  }

  onDeleteConfirm() {
    if (this.selectedContact()) {
      this.contactsService.deleteContact(this.selectedContact()!._id!);
      this.toggles.delete = false;
    }
  }

  ngOnDestroy(): void {
    this.contactsService.disconnect();
  }
}
