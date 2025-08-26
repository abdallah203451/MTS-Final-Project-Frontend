import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { WorkOrderDTO } from '../../../core/models/work-order.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentService } from '../../../core/services/assignment.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChip } from '@angular/material/chips';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-work-order-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatChip,
    MatProgressSpinner,
  ],
  templateUrl: './work-order-detail.component.html',
  styleUrls: ['./work-order-detail.component.css'],
})
export class WorkOrderDetailComponent implements OnInit {
  id!: number;
  work?: WorkOrderDTO;
  loading = false;

  constructor(
    private svc: WorkOrderService,
    private assignmentSvc: AssignmentService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getWorkOrderById(this.id).subscribe({
      next: (w) => {
        this.work = w;
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Failed to load', 'Close', { duration: 3000 });
        console.error(err);
      },
    });
  }

  // determine if assigned
  isAssigned(): boolean {
    return (
      !!this.work &&
      (this.work.status === 'Assigned' || this.work.status === 'InProgress')
    );
  }

  isNotAssigned(): boolean {
    return (
      !!this.work && (this.work.status === 'NotAssigned' || !this.work.status)
    );
  }

  // ... inside WorkOrderDetailComponent
  goToAssign(): void {
    this.router.navigate(['/work-orders', this.id, 'assign'], {
      queryParams: { mode: 'assign' },
    });
  }

  goToReassign(): void {
    this.router.navigate(['/work-orders', this.id, 'assign'], {
      queryParams: { mode: 'reassign' },
    });
  }

  // goToAssign(): void {
  //   this.router.navigate(['/work-orders', this.id, 'assign']);
  // }

  // allow cancel?
  canForceCancel(): boolean {
    if (!this.work) return false;
    const notAllowed = ['Completed', 'Cancelled']; // adapt
    return !notAllowed.includes(this.work.status || '');
  }

  onForceCancel(): void {
    if (!this.work) return;
    const ok = window.confirm(
      `Force-cancel work order #${this.work.workOrderId}?\nThis action cannot be undone.`
    );
    if (!ok) return;

    this.svc.forceCancel(this.work.workOrderId).subscribe({
      next: (updated) => {
        if (updated) {
          this.work = updated;
        } else {
          this.work!.status = 'Cancelled';
        }
        this.snack.open('Work order force-cancelled', 'OK', { duration: 3000 });
      },
      error: (err) => {
        console.error('Force cancel failed', err);
        this.snack.open('Failed to force cancel', 'Close', { duration: 4000 });
      },
    });
  }
}
