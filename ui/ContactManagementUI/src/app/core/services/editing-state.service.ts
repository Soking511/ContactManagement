import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditingStateService {
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
    
    this.currentlyEditing.set({ field, element });
    return true;
  }

  stopEditing(): void {
    this.currentlyEditing.set({ field: null, element: null });
  }
}
