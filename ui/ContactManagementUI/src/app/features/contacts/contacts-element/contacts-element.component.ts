import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditingStateService } from '../../../core/services/editing-state.service';
import { IContactWithLock } from '../../../core/interfaces/contactInterface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-contacts-element',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative group" #elementContainer>
      @if (editingState.isEditing(elementContainer)) {
        <div class="flex items-center gap-1">
          <input
            #inputElement
            type="text"
            [value]="value"
            (blur)="onBlur($event)"
            (keyup.enter)="onBlur($event)"
            (keyup.escape)="cancelEdit()"
            class="flex-1 px-1 py-0.5 border border-emerald-500 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <span class="material-icons text-emerald-500 text-sm animate-pulse">edit</span>
        </div>
      } @else {
        <div
          [class]="getElementClasses()"
          (dblclick)="canEdit && startEditing(elementContainer)"
          [title]="getTooltip()"
        >
          <div class="flex items-center gap-1">
            <span [class.text-gray-500]="isLockedByOther">{{ value }}</span>
            @if (isLockedByOther) {
              <div class="flex items-center gap-1 text-gray-400">
                <span class="material-icons text-sm">lock</span>
                <span class="text-xs italic">Editing...</span>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `,
  styleUrls: ['./contacts-element.scss'],
})
export class ContactsElementComponent {
  @Input() value: string = '';
  @Input() field: string = '';
  @Input() contact!: IContactWithLock;
  @Output() valueChange = new EventEmitter<{ field: string; value: string }>();

  protected editingState = inject(EditingStateService);
  protected authService = inject(AuthService);

  get isLockedByOther(): boolean {
    return !!(
      this.contact.lock &&
      this.contact.lock.userId !== this.authService.user()?._id
    );
  }

  get canEdit(): boolean {
    return !this.contact.lock || this.contact.lock.userId === this.authService.user()?._id;
  }

  getElementClasses(): string {
    const baseClasses = 'px-1 py-0.5 rounded';
    return this.canEdit 
      ? `${baseClasses} editable-field` 
      : `${baseClasses} disabled-field`;
  }

  getTooltip(): string {
    if (this.isLockedByOther) {
      return 'This field is currently being edited by another user';
    }
    return this.canEdit ? 'Double-click to edit' : '';
  }

  startEditing(element: HTMLElement): void {
    if (!this.canEdit) return;
    
    const canEdit = this.editingState.startEditing(this.field, element);
    if (canEdit) {
      setTimeout(() => {
        const input = element.querySelector('input');
        if (input) {
          input.focus();
          input.select();
        }
      });
    }
  }

  onBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newValue = target.value.trim();

    if (newValue !== this.value) {
      this.valueChange.emit({ field: this.field, value: newValue });
    }

    this.editingState.stopEditing();
  }

  cancelEdit(): void {
    this.editingState.stopEditing();
  }
}
