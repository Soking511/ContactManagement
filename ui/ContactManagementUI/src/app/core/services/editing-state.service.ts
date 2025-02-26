import { inject, Injectable, signal } from '@angular/core';
import { ContactsService } from './contacts.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EditingStateService {
  private contactsService = inject(ContactsService);
  private authService = inject(AuthService);
  private currentlyEditing = signal<{ field: string | null, element: HTMLElement | null }>({
    field: null,
    element: null
  });

  isEditing(element: HTMLElement): boolean {
    const current = this.currentlyEditing();
    
    if (current.element === element) {
      return true;
    }
    
    return false;
  }

  startEditing(field: string, element: HTMLElement): boolean {
    const current = this.currentlyEditing();
    
    // If this exact element is already being edited
    if (current.element === element) {
      return true;
    }
    
    // If the same field type is being edited in another element
    if (current.field === field) {
      
      return false;
    }
    
    this.contactsService.socket.emit('contact:locked', this.contactsService.selectedContact()?._id, this.authService.user()?._id);
    this.currentlyEditing.set({ field, element });
    return true;
  }

  stopEditing(): void {
    this.contactsService.socket.emit('contact:unlocked', this.contactsService.selectedContact()?._id, this.authService.user()?._id);
    this.currentlyEditing.set({ field: null, element: null });
  }
}
