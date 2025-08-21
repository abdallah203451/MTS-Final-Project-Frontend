// src/app/features/work-orders/work-order-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { Router, RouterModule } from '@angular/router';
import {
  WorkOrderDTO,
  WorkOrderSearchCriteria,
} from '../../../core/models/work-order.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-work-order-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatChipsModule,
  ],
  templateUrl: './work-order-list.component.html',
  styleUrls: ['./work-order-list.component.css'],
})
export class WorkOrderListComponent implements OnInit {
  searchQ = '';
  workOrders: WorkOrderDTO[] = [];
  displayedColumns = [
    'workOrderId',
    'title',
    'customerName',
    'proposedSchedulingDate',
    'status',
    'createdByName',
    'actions',
  ];
  page = 0;
  size = 20;
  loading = false;

  constructor(
    private svc: WorkOrderService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    const criteria: WorkOrderSearchCriteria = { q: this.searchQ };
    this.svc.getWorkOrders(this.page, this.size, criteria).subscribe({
      next: (p) => {
        this.workOrders = p.content;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Failed to load work orders', 'Close', {
          duration: 3000,
        });
        console.error(err);
      },
    });
  }

  search(): void {
    this.page = 0;
    this.load();
  }

  clear(): void {
    this.searchQ = '';
    this.search();
  }

  view(id: number): void {
    this.router.navigate(['/work-orders', id]);
  }

  edit(id: number): void {
    this.router.navigate(['/work-orders', id, 'edit']);
  }

  create(): void {
    this.router.navigate(['/work-orders/create']);
  }

  // helper to show readable status (optional customization)
  statusLabel(status?: string): string {
    if (!status) return 'Unknown';
    switch (status) {
      case 'Assigned':
        return 'Assigned';
      case 'NotAssigned':
        return 'Not Assigned';
      case 'InProgress':
        return 'In Progress';
      case 'Completed':
        return 'Completed';
      default:
        return status;
    }
  }

  statusColor(status?: string): 'primary' | 'warn' | 'accent' | undefined {
    if (!status) return undefined;
    if (status === 'Assigned' || status === 'InProgress') return 'primary';
    if (status === 'NotAssigned') return 'warn';
    if (status === 'Completed') return 'accent';
    return undefined;
  }

  // helper to determine visibility of force-cancel
  showForceCancel(row: WorkOrderDTO): boolean {
    if (!row || !row.status) return true; // default show if no status
    const notAllowed = ['Completed', 'Cancelled']; // adjust your statuses
    return !notAllowed.includes(row.status);
  }

  // handler invoked by template
  onForceCancel(row: WorkOrderDTO): void {
    if (!row || !row.workOrderId) return;
    const ok = window.confirm(
      `Force-cancel work order #${row.workOrderId}?\nThis action cannot be undone.`
    );
    if (!ok) return;

    this.svc.forceCancel(row.workOrderId).subscribe({
      next: (updated) => {
        // update local row with returned payload (if backend returns object)
        if (updated) {
          // replace the row in the array in-place so the table refreshes
          const idx = this.workOrders.findIndex(
            (w) => w.workOrderId === updated.workOrderId
          );
          if (idx >= 0) this.workOrders[idx] = updated;
        } else {
          // If backend returns nothing, reflect cancellation locally
          row.status = 'Cancelled';
        }
        this.snack.open('Work order force-cancelled', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error('Failed to force cancel', err);
        this.snack.open('Failed to force cancel', 'Close', { duration: 4000 });
      },
    });
  }
}
