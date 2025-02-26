import { Component, inject, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsService } from '../../../core/services/contacts.service';
import { PopupComponent } from "../../../shared/components/popup/popup.component";
import { ContactsFormComponent } from "../contacts-form/contacts-form.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IContact } from '../../../core/interfaces/contactInterface';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { ButtonComponent } from "../../../shared/components/button/button.component";

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [CommonModule, PopupComponent, ContactsFormComponent, ReactiveFormsModule, PaginationComponent, ButtonComponent],
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnDestroy {
  contacts;
  selectedContact = signal<IContact | null>(null);
  addContactForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3)
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email
    ]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/)
    ]),
    notes: new FormControl<string>(''),
    address: new FormGroup({
      street: new FormControl<string>('', [Validators.required]),
      city: new FormControl<string>('', [Validators.required]),
      country: new FormControl<string>('', [Validators.required])
    })
  });

  toggles = {
    create: false,
    delete: false
  }

  contactsService = inject(ContactsService);
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

  onCreateConfirm() {
    if (this.addContactForm.valid) {
      const formValue = this.addContactForm.value;
      const contact: IContact = {
        name: formValue.name!,
        email: formValue.email!,
        phone: formValue.phone!,
        notes: formValue.notes || '',
        address: {
          street: formValue.address?.street!,
          city: formValue.address?.city!,
          country: formValue.address?.country!
        }
      };

      this.contactsService.createContact(contact);
      this.toggles.create = false;
      this.addContactForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.addContactForm.controls).forEach(key => {
        const control = this.addContactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
        if (key === 'address') {
          const addressGroup = control as FormGroup;
          Object.keys(addressGroup.controls).forEach(addressKey => {
            const addressControl = addressGroup.get(addressKey);
            if (addressControl?.invalid) {
              addressControl.markAsTouched();
            }
          });
        }
      });
    }
  }

  onDeleteConfirm() {
    if (this.selectedContact()) {
      this.contactsService.deleteContact(this.selectedContact()!._id!);
      this.toggles.delete = false;
    }
  }
}
