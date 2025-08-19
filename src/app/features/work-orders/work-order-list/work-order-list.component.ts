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
}
