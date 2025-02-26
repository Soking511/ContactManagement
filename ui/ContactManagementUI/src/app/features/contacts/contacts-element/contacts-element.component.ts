import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditingStateService } from '../../../core/services/editing-state.service';

@Component({
  selector: 'app-contacts-element',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relative group" #elementContainer>
      @if (!editingState.isEditing(elementContainer)) {
        <div
          class="cursor-pointer group-hover:bg-gray-50 px-1 py-0.5 rounded"
          (dblclick)="startEditing(elementContainer)"
        >
          {{ value }}
        </div>
      } @else {
        <input
          #inputElement
          type="text"
          [value]="value"
          (blur)="onBlur($event)"
          (keyup.enter)="onBlur($event)"
          (keyup.escape)="cancelEdit()"
          class="px-1 py-0.5 border border-emerald-500 rounded text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ContactsElementComponent {
  @Input() value: string = '';
  @Input() field: string = '';
  @Output() valueChange = new EventEmitter<{field: string, value: string}>();

  protected editingState = inject(EditingStateService);

  startEditing(element: HTMLElement): void {
    const canEdit = this.editingState.startEditing(this.field, element);
    
    if (canEdit) {
      // Focus the input element in the next tick after it's rendered
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
