import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentService } from '../../../core/services/assignment.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AvailableEmployeeDTO } from '../../../core/models/employee.model';
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
import { WorkOrderDTO } from '../../../core/models/work-order.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

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
    MatProgressSpinner,
  ],
  templateUrl: './work-order-assignment.component.html',
  styleUrls: ['./work-order-assignment.component.css'],
})
export class WorkOrderAssignmentComponent implements OnInit {
  workOrderId!: number;
  technicians: AvailableEmployeeDTO[] = [];
  selectedTechId?: number;
  assigning = false;

  // mode: 'assign' | 'reassign'
  mode: 'assign' | 'reassign' = 'assign';

  // optional loaded work order for fallback/status check
  workOrder?: WorkOrderDTO;

  loadingTechnicians = false;

  constructor(
    private assignmentSvc: AssignmentService,
    private employeeSvc: EmployeeService,
    private workOrderSvc: WorkOrderService,
    private route: ActivatedRoute,
    private snack: MatSnackBar,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.workOrderId = Number(this.route.snapshot.paramMap.get('id'));

    const qpMode = this.route.snapshot.queryParamMap.get('mode');
    if (qpMode === 'reassign') {
      this.mode = 'reassign';
    } else if (qpMode === 'assign') {
      this.mode = 'assign';
    }

    // Always load the work order since we need proposedSchedulingDate
    this.workOrderSvc.getWorkOrderById(this.workOrderId).subscribe({
      next: (w) => {
        this.workOrder = w;

        // If mode wasn't explicitly provided, decide by status
        if (!qpMode) {
          if (w.status === 'Assigned' || w.status === 'InProgress') {
            this.mode = 'reassign';
          } else {
            this.mode = 'assign';
          }
        }

        const dateToSend = this.getDateToSend(w?.proposedSchedulingDate);
        this.loadTechnicians(dateToSend);
      },
      error: (err) => {
        console.warn(
          "Could not fetch work order for mode fallback or proposed date; loading technicians using today's date",
          err
        );
        const today = this.formatDateYYYYMMDD(new Date());
        this.loadTechnicians(today);
      },
    });
  }

  /**
   * Determine the date string to send to the API.
   * - If input is a valid YYYY-MM-DD -> return it as-is.
   * - If input is an ISO datetime or other parseable string -> take its date part (local).
   * - If input is falsy/invalid -> fallback to today's date (YYYY-MM-DD).
   */
  private getDateToSend(proposedSchedulingDate?: string): string {
    const formatted = this.formatStringToYYYYMMDD(proposedSchedulingDate);
    if (formatted) return formatted;

    // fallback: today's date
    return this.formatDateYYYYMMDD(new Date());
  }

  private formatStringToYYYYMMDD(input?: string): string | undefined {
    if (!input) return undefined;

    // already yyyy-mm-dd?
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

    // try parse (handles ISO datetimes)
    const parsed = new Date(input);
    if (!isNaN(parsed.getTime())) {
      return this.formatDateYYYYMMDD(parsed);
    }

    return undefined;
  }

  private formatDateYYYYMMDD(d: Date): string {
    const y = d.getFullYear();
    const m = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${dd}`;
  }

  loadTechnicians(date: string): void {
    this.loadingTechnicians = true;

    // Uses your service method exactly as provided:
    // getAvailableEmployees(date: string): Observable<AvailableEmployeeDTO[]>
    this.employeeSvc.getAvailableEmployees(date).subscribe({
      next: (list) => {
        this.technicians = list;
        this.loadingTechnicians = false;
      },
      error: (err) => {
        console.error('Failed to load available technicians', err);
        this.loadingTechnicians = false;
        this.technicians = [];
      },
    });
  }

  // single submit method: behave according to mode
  submit(): void {
    if (!this.selectedTechId) return;

    if (this.mode === 'assign') {
      this.doAssign();
    } else {
      this.doReassign();
    }
  }

  private doAssign(): void {
    const dto: AssignmentCreateDTO = {
      workOrderId: this.workOrderId,
      employeeId: this.selectedTechId!,
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

  private doReassign(): void {
    const dto: ReassignmentDTO = {
      workOrderId: this.workOrderId,
      newEmployeeId: this.selectedTechId!,
    };
    this.assigning = true;
    this.assignmentSvc.reassignWorkOrder(dto).subscribe({
      next: () => {
        this.assigning = false;
        this.snack.open('Reassigned successfully', 'OK', { duration: 2500 });
        // navigate back to work order details
        this.router.navigate(['/work-orders', this.workOrderId]);
      },
      error: (err) => {
        this.assigning = false;
        this.snack.open('Failed to reassign: ' + (err?.error || ''), 'Close', {
          duration: 4000,
        });
      },
    });
  }

  // helpers for the template
  isReassign(): boolean {
    return this.mode === 'reassign';
  }

  getTitle(): string {
    return this.isReassign() ? 'Reassign Work Order' : 'Assign Work Order';
  }

  getActionLabel(): string {
    return this.isReassign() ? 'Reassign' : 'Assign';
  }
}
