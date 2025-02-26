import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IContact } from '../../../core/interfaces/contactInterface';

@Component({
  selector: 'app-contacts-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" class="space-y-4">
      <div>
        <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          id="name"
          formControlName="name"
          class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <ng-container *ngIf="form.get('name')?.invalid && form.get('name')?.touched">
          <p class="mt-1 text-sm text-red-600">Name is required and must be at least 3 characters</p>
        </ng-container>
      </div>

      <div>
        <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          id="email"
          formControlName="email"
          class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <ng-container *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
          <p class="mt-1 text-sm text-red-600">Please enter a valid email address</p>
        </ng-container>
      </div>

      <div>
        <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          id="phone"
          formControlName="phone"
          class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <ng-container *ngIf="form.get('phone')?.invalid && form.get('phone')?.touched">
          <p class="mt-1 text-sm text-red-600">Phone number must be 11 digits</p>
        </ng-container>
      </div>

      <div>
        <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
        <textarea
          id="notes"
          formControlName="notes"
          rows="3"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>

      <div formGroupName="address" class="space-y-4 p-4 border border-gray-200 rounded-md">
        <h4 class="font-medium text-gray-900">Address</h4>
        
        <div>
          <label for="street" class="block text-sm font-medium text-gray-700">Street</label>
          <input
            type="text"
            id="street"
            formControlName="street"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container *ngIf="form.get('address.street')?.invalid && form.get('address.street')?.touched">
            <p class="mt-1 text-sm text-red-600">Street is required</p>
          </ng-container>
        </div>

        <div>
          <label for="city" class="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            id="city"
            formControlName="city"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container *ngIf="form.get('address.city')?.invalid && form.get('address.city')?.touched">
            <p class="mt-1 text-sm text-red-600">City is required</p>
          </ng-container>
        </div>

        <div>
          <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            id="country"
            formControlName="country"
            class="p-1 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <ng-container *ngIf="form.get('address.country')?.invalid && form.get('address.country')?.touched">
            <p class="mt-1 text-sm text-red-600">Country is required</p>
          </ng-container>
        </div>
      </div>
    </form>
  `,
  styles: []
})
export class ContactsFormComponent {
  @Input() data?: IContact;
  @Input() form!: FormGroup;
}
