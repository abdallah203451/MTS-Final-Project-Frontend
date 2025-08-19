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

  goToAssign(): void {
    this.router.navigate(['/work-orders', this.id, 'assign']);
  }
}
