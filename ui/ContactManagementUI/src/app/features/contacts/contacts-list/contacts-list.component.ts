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

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    CommonModule,
    PopupComponent,
    ContactsFormComponent,
    ReactiveFormsModule,
    PaginationComponent,
    ButtonComponent,
    SessionTimeoutComponent,
  ],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss'],
})
export class ContactsListComponent implements OnDestroy {
  selectedContact = signal<IContact | null>(null);
  contactsService = inject(ContactsService);
  contacts;
  toggles = {
    create: false,
    delete: false,
  };

  constructor() {
    this.contacts = this.contactsService.contacts;
  }

  ngOnDestroy(): void {
    this.contactsService.disconnect();
  }

  deleteContact(id: string): void {
    this.contactsService.deleteContact(id);
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
}
