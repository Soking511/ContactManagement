import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IContact } from '../../../core/interfaces/contactInterface';
import { PopupComponent } from '../../../shared/components/popup/popup.component';
import { ContactsService } from '../../../core/services/contacts.service';

@Component({
  selector: 'app-contacts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PopupComponent],
  template: `
    <app-popup
      [isOpen]="toggleCreate"
      (closePopup)="onCloseCreateContactForm()"
      title="Contact Create"
      [showConfirmButton]="true"
      (confirmPopup)="onCreateConfirm()"
    >
      <form [formGroup]="addContactForm" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700"
            >Name</label
          >
          <input
            type="text"
            id="name"
            formControlName="name"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container
            *ngIf="
              addContactForm.get('name')?.invalid &&
              addContactForm.get('name')?.touched
            "
          >
            <p class="mt-1 text-sm text-red-600">
              Name is required and must be at least 3 characters
            </p>
          </ng-container>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700"
            >Email</label
          >
          <input
            type="email"
            id="email"
            formControlName="email"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container
            *ngIf="
              addContactForm.get('email')?.invalid &&
              addContactForm.get('email')?.touched
            "
          >
            <p class="mt-1 text-sm text-red-600">
              Please enter a valid email address
            </p>
          </ng-container>
        </div>

        <div>
          <label for="phone" class="block text-sm font-medium text-gray-700"
            >Phone</label
          >
          <input
            type="tel"
            id="phone"
            formControlName="phone"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container
            *ngIf="
              addContactForm.get('phone')?.invalid &&
              addContactForm.get('phone')?.touched
            "
          >
            <p class="mt-1 text-sm text-red-600">
              Phone number must be 11 digits
            </p>
          </ng-container>
        </div>

        <div>
          <label for="notes" class="block text-sm font-medium text-gray-700"
            >Notes</label
          >
          <textarea
            id="notes"
            formControlName="notes"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div
          formGroupName="address"
          class="space-y-4 p-4 border border-gray-200 rounded-md"
        >
          <h4 class="font-medium text-gray-900">Address</h4>

          <div>
            <label for="street" class="block text-sm font-medium text-gray-700"
              >Street</label
            >
            <input
              type="text"
              id="street"
              formControlName="street"
              class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <ng-container
              *ngIf="
                addContactForm.get('address.street')?.invalid &&
                addContactForm.get('address.street')?.touched
              "
            >
              <p class="mt-1 text-sm text-red-600">Street is required</p>
            </ng-container>
          </div>

          <div>
            <label for="city" class="block text-sm font-medium text-gray-700"
              >City</label
            >
            <input
              type="text"
              id="city"
              formControlName="city"
              class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <ng-container
              *ngIf="
                addContactForm.get('address.city')?.invalid &&
                addContactForm.get('address.city')?.touched
              "
            >
              <p class="mt-1 text-sm text-red-600">City is required</p>
            </ng-container>
          </div>

          <div>
            <label for="country" class="block text-sm font-medium text-gray-700"
              >Country</label
            >
            <input
              type="text"
              id="country"
              formControlName="country"
              class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <ng-container
              *ngIf="
                addContactForm.get('address.country')?.invalid &&
                addContactForm.get('address.country')?.touched
              "
            >
              <p class="mt-1 text-sm text-red-600">Country is required</p>
            </ng-container>
          </div>
        </div>
      </form>
    </app-popup>
  `,
  styles: [],
})
export class ContactsFormComponent {
  @Input() data?: IContact;
  @Input() toggleCreate: boolean = false;

  @Output() closedCreateContactForm = new EventEmitter<void>();

  contactsService = inject(ContactsService);

  addContactForm = new FormGroup({
    name: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [
      Validators.required,
      Validators.pattern(/^[0-9]{11}$/),
    ]),
    notes: new FormControl<string>(''),
    address: new FormGroup({
      street: new FormControl<string>('', [Validators.required]),
      city: new FormControl<string>('', [Validators.required]),
      country: new FormControl<string>('', [Validators.required]),
    }),
  });

  constructor() {}
  // emit when close

  onCloseCreateContactForm() {
    this.toggleCreate = false;
    this.closedCreateContactForm.emit();
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
          country: formValue.address?.country!,
        },
      };

      this.contactsService.createContact(contact);
      this.toggleCreate = false;
      this.closedCreateContactForm.emit();
      this.addContactForm.reset();
    } else {
      // Mark all fields as touched to trigger validation messages
      Object.keys(this.addContactForm.controls).forEach((key) => {
        const control = this.addContactForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
        if (key === 'address') {
          const addressGroup = control as FormGroup;
          Object.keys(addressGroup.controls).forEach((addressKey) => {
            const addressControl = addressGroup.get(addressKey);
            if (addressControl?.invalid) {
              addressControl.markAsTouched();
            }
          });
        }
      });
    }
  }
}
