import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPagination } from '../../../core/interfaces/paginationInterface';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center space-x-1 my-4" *ngIf="pagination && pagination.totalPages > 0">
      <!-- Previous button -->
      <button
        (click)="onPageChange(pagination.currentPage - 1 || pagination.currentPage)"
        [disabled]="pagination.currentPage === 1"
        [ngClass]="pagination.currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
        class="px-3 py-1 rounded-md"
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- First page (if not in view) -->
      <ng-container *ngIf="getPageNumbers()[0] > 1">
        <button
          (click)="onPageChange(1)"
          class="px-3 py-1 rounded-md hover:bg-gray-100 text-gray-700"
        >
          1
        </button>
        <span *ngIf="getPageNumbers()[0] > 2" class="px-1 text-gray-500">...</span>
      </ng-container>

      <!-- Page numbers -->
      <ng-container *ngFor="let page of getPageNumbers()">
        <button
          (click)="onPageChange(page)"
          [ngClass]="pagination.currentPage === page ? 'bg-blue-500 text-white' : 'hover:bg-gray-100 text-gray-700'"
          class="px-3 py-1 rounded-md"
          [attr.aria-current]="pagination.currentPage === page ? 'page' : null"
        >
          {{ page }}
        </button>
      </ng-container>

      <!-- Last page (if not in view) -->
      <ng-container *ngIf="getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages">
        <span *ngIf="getPageNumbers()[getPageNumbers().length - 1] < pagination.totalPages - 1" class="px-1 text-gray-500">...</span>
        <button
          (click)="onPageChange(pagination.totalPages)"
          class="px-3 py-1 rounded-md hover:bg-gray-100 text-gray-700"
        >
          {{ pagination.totalPages }}
        </button>
      </ng-container>

      <!-- Next button -->
      <button
        (click)="onPageChange(pagination.currentPage + 1 || pagination.currentPage)"
        [disabled]="pagination.currentPage === pagination.totalPages"
        [ngClass]="pagination.currentPage === pagination.totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'"
        class="px-3 py-1 rounded-md"
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  `
})
export class PaginationComponent {
  @Input() pagination!: IPagination;
  @Output() pageChanged = new EventEmitter<number>();
  
  onPageChange(page: number): void {
    if (page !== this.pagination.currentPage) {
      this.pageChanged.emit(page);
    }
  }
  
  getPageNumbers(): number[] {
    if (!this.pagination) return [];
    
    const { currentPage, totalPages } = this.pagination;
    const pages: number[] = [];
    
    // Show at most 5 page numbers
    const maxPagesToShow = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }
}
