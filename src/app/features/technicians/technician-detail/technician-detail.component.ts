import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeDTO } from '../../../core/models/employee.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { DaySlotsDTO } from '../../../core/models/assignment.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatChip } from "@angular/material/chips";

@Component({
  selector: 'app-technician-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatProgressSpinner,
    MatChip
],
  templateUrl: './technician-detail.component.html',
  styleUrls: ['./technician-detail.component.css'],
})
export class TechnicianDetailComponent implements OnInit {
  id!: number;
  tech?: EmployeeDTO;
  slots: DaySlotsDTO[] = [];
  loading = false;

  constructor(
    private svc: EmployeeService,
    private assignmentSvc: AssignmentService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.load();
      this.loadSlots();
    }
  }

  load(): void {
    this.svc.getEmployeeById(this.id).subscribe({
      next: (t) => (this.tech = t),
      error: (err) =>
        this.snack.open('Failed to load technician', 'Close', {
          duration: 2000,
        }),
    });
  }

  loadSlots(): void {
    // get next 7 days of availability
    this.assignmentSvc.getAvailableDates().subscribe({
      next: (days) => {
        // server may return availability across technicians — filter if necessary
        this.slots = days as unknown as DaySlotsDTO[]; // best-effort; adapt if backend endpoint differs
      },
      error: (err) => console.error(err),
    });
  }

  public navigateToTechnicians(): void {
    this.router.navigate(['/technicians']);
  }
}
