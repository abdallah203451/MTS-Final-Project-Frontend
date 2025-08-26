import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrderCreateDTO } from '../../../core/models/work-order.model';
import { AssignmentService } from '../../../core/services/assignment.service';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-work-order-create',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatIconModule,
    MatOption,
    MatSelectModule,
    MatProgressSpinner,
  ],
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.css'],
})
export class WorkOrderCreateComponent implements OnInit {
  PHONE_REGEX = /^(010|011|012|015)\d{8}$/;
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    customerName: new FormControl('', Validators.required),
    customerMobile: new FormControl('', [
      Validators.required,
      Validators.pattern(this.PHONE_REGEX),
    ]),
    customerEmail: new FormControl('', Validators.email),
    customerAddress: new FormControl(''),
    proposedSchedulingDate: new FormControl('', [
      Validators.required,
      this.dateWithinNext14DaysValidator,
    ]),
  });
  dateOptions: string[] = [];
  loadingDates = false;
  saving = false;

  constructor(
    private svc: WorkOrderService,
    public router: Router,
    private snack: MatSnackBar,
    private assignmentSvc: AssignmentService
  ) {}

  ngOnInit(): void {
    // load available dates from backend (no id) -- backend will use today as start
    this.assignmentSvc.getAvailableDates().subscribe({
      next: (dates) => {
        // dates is string[] like ["2025-08-20", ...]
        if (Array.isArray(dates) && dates.length > 0) {
          // store as dateOptions for mat-select
          this.dateOptions = dates;
          // choose first option by default
          this.form.get('proposedSchedulingDate')!.setValue(dates[0]);
        }
      },
      error: (err) => {
        console.error('Failed to load available dates', err);
        // fallback: keep native date input validator; or show message to user
      },
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const dto: WorkOrderCreateDTO = {
      title: this.form.get('title')!.value as string,
      description: (this.form.get('description')!.value as string) || undefined,
      customerName: this.form.get('customerName')!.value as string,
      customerMobile: this.form.get('customerMobile')!.value as string,
      customerEmail:
        (this.form.get('customerEmail')!.value as string) || undefined,
      customerAddress:
        (this.form.get('customerAddress')!.value as string) || undefined,
      // ensure the date is a YYYY-MM-DD string (from date input): the control value will be that
      proposedSchedulingDate: this.form.get('proposedSchedulingDate')!
        .value as string,
    };

    this.svc.createWorkOrder(dto).subscribe({
      next: (w) => {
        this.saving = false;
        this.snack.open('Work order created', 'OK', { duration: 2500 });
        this.router.navigate(['/work-orders', w.workOrderId]);
      },
      error: (err) => {
        this.saving = false;
        this.snack.open('Failed to create work order', 'Close', {
          duration: 3000,
        });
        console.error(err);
      },
    });
  }

  // Custom validator: date must be between today and today + 14 days (inclusive).
  dateWithinNext14DaysValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const v = control.value;
    if (!v) return null; // required validator handles empty
    const date = new Date(v);
    if (isNaN(date.getTime())) {
      return { invalidDate: true };
    }
    // Compare date-only (drop time)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const max = new Date(today);
    max.setDate(max.getDate() + 14);
    date.setHours(0, 0, 0, 0);

    if (date < today) {
      return { dateTooEarly: { min: today.toISOString().slice(0, 10) } };
    }
    if (date > max) {
      return { dateTooLate: { max: max.toISOString().slice(0, 10) } };
    }
    return null;
  }
}
