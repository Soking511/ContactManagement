import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPagination } from '../../../core/interfaces/paginationInterface';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center gap-2 my-4" *ngIf="pagination?.totalPages! > 0">
      <button
        (click)="onPageChange(pagination.currentPage - 1)"
        [disabled]="pagination.currentPage === 1"
        class="px-3 py-1 rounded-md"
        [class.opacity-50]="pagination.currentPage === 1"
      >
        Previous
      </button>

      <span class="mx-2">
        Page {{ pagination.currentPage }} of {{ pagination.totalPages }}
      </span>

      <button
        (click)="onPageChange(pagination.currentPage + 1)"
        [disabled]="pagination.currentPage === pagination.totalPages"
        class="px-3 py-1 rounded-md"
        [class.opacity-50]="pagination.currentPage === pagination.totalPages"
      >
        Next
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() pagination!: IPagination;
  @Output() pageChanged = new EventEmitter<number>();
  
  onPageChange(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages && page !== this.pagination.currentPage) {
      this.pageChanged.emit(page);
    }
  }
}
