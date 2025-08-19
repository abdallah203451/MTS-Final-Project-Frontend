import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../core/services/assignment.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EmployeeDTO } from '../../../core/models/employee.model';
import {
  AssignmentCreateDTO,
  ReassignmentDTO,
} from '../../../core/models/assignment.model';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-work-order-assignment',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './work-order-assignment.component.html',
  styleUrls: ['./work-order-assignment.component.css'],
})
export class WorkOrderAssignmentComponent implements OnInit {
  workOrderId!: number;
  technicians: EmployeeDTO[] = [];
  selectedTechId?: number;
  assigning = false;

  constructor(
    private assignmentSvc: AssignmentService,
    private employeeSvc: EmployeeService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.workOrderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTechnicians();
  }

  loadTechnicians(): void {
    this.employeeSvc.getAllEmployees().subscribe({
      next: (list) =>
        (this.technicians = list.filter((x) => x.role === 'Technician')),
      error: (err) => console.error(err),
    });
  }

  assign(): void {
    if (!this.selectedTechId) return;
    const dto: AssignmentCreateDTO = {
      workOrderId: this.workOrderId,
      employeeId: this.selectedTechId,
    };
    this.assigning = true;
    this.assignmentSvc.createAssignment(dto).subscribe({
      next: (a) => {
        this.assigning = false;
        this.snack.open('Assigned successfully', 'OK', { duration: 2500 });
        this.router.navigate(['/work-orders', this.workOrderId]);
      },
      error: (err) => {
        this.assigning = false;
        this.snack.open('Failed to assign: ' + (err?.error || ''), 'Close', {
          duration: 4000,
        });
      },
    });
  }

  reassign(newTechId: number): void {
    const dto: ReassignmentDTO = {
      workOrderId: this.workOrderId,
      newEmployeeId: newTechId,
    };
    this.assignmentSvc.reassignWorkOrder(dto).subscribe({
      next: () => this.snack.open('Reassigned', 'OK', { duration: 2000 }),
      error: (err) =>
        this.snack.open('Failed to reassign', 'Close', { duration: 3000 }),
    });
  }
}
