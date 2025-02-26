import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
    <div class="fixed inset-0 z-10 overflow-y-auto" [@overlay]="true">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-base font-semibold leading-6 text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <ng-content></ng-content>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            @if (showConfirmButton) {
            <app-button
              [cooldown]="'3'"
              [variant]="'primary'"
              (buttonClick)="confirmPopup.emit()"
              >{{confirmButtonText}}</app-button
            >
            } @if( closeButton ){

            <app-button
              [cooldown]="'3'"
              [variant]="'secondary'"
              (buttonClick)="closePopup.emit()"
              >Cancel</app-button
            >
            }
          </div>
        </div>
      </div>
    </div>
    }
  `,
  animations: [
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class PopupComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() showConfirmButton = false;
  @Input() closeButton = true;
  @Input() confirmButtonText = 'Confirm';
  @Output() closePopup = new EventEmitter<void>();
  @Output() confirmPopup = new EventEmitter<void>();
}
