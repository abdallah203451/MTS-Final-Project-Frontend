import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { WorkOrderUpdateDTO } from '../../../core/models/work-order.model';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatChip } from "@angular/material/chips";

@Component({
  selector: 'app-work-order-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinner,
    MatChip
],
  templateUrl: './work-order-edit.component.html',
  styleUrls: ['./work-order-edit.component.css'],
})
export class WorkOrderEditComponent implements OnInit {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    customerName: new FormControl('', Validators.required),
    customerMobile: new FormControl('', Validators.required),
    customerEmail: new FormControl('', Validators.email),
    customerAddress: new FormControl(''),
    proposedSchedulingDate: new FormControl('', Validators.required),
  });

  id!: number;
  loading = false;
  saving = false;

  // date options are simple strings now
  dateOptions: string[] = [];
  loadingDates = false;

  constructor(
    private svc: WorkOrderService,
    private assignmentSvc: AssignmentService,
    private route: ActivatedRoute,
    public router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    // load available dates for this work order
    this.loadAvailableDates();

    if (this.id) {
      this.loading = true;
      this.svc.getWorkOrderById(this.id).subscribe({
        next: (w) => {
          this.loading = false;
          this.form.patchValue({
            title: w.title,
            description: w.description,
            customerName: w.customerName,
            customerMobile: w.customerMobile,
            customerEmail: w.customerEmail,
            customerAddress: w.customerAddress,
            proposedSchedulingDate: w.proposedSchedulingDate,
          });
        },
        error: (err) => {
          this.loading = false;
          this.snack.open('Failed to load work order', 'Close', {
            duration: 3000,
          });
          console.error(err);
        },
      });
    }
  }

  private loadAvailableDates(): void {
    if (!this.id) return;
    this.loadingDates = true;
    // pass workOrderId to API per your swagger spec
    this.assignmentSvc.getAvailableDates(this.id).subscribe({
      next: (dates) => {
        // API returns strings like "2025-08-20"
        this.dateOptions = Array.isArray(dates) ? dates : [];
        this.loadingDates = false;
      },
      error: (err) => {
        this.loadingDates = false;
        this.snack.open('Failed to load available dates', 'Close', {
          duration: 3000,
        });
        console.error(err);
      },
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    const dto: WorkOrderUpdateDTO = {
      title: this.form.get('title')!.value as string,
      description: (this.form.get('description')!.value as string) ?? undefined,
      customerName: this.form.get('customerName')!.value as string,
      customerMobile: this.form.get('customerMobile')!.value as string,
      customerEmail:
        (this.form.get('customerEmail')!.value as string) ?? undefined,
      customerAddress:
        (this.form.get('customerAddress')!.value as string) ?? undefined,
      proposedSchedulingDate: this.form.get('proposedSchedulingDate')!
        .value as string,
    };

    this.svc.updateWorkOrder(this.id, dto).subscribe({
      next: (w) => {
        this.saving = false;
        this.snack.open('Saved', 'OK', { duration: 2000 });
        this.router.navigate(['/work-orders', this.id]);
      },
      error: (err) => {
        this.saving = false;
        this.snack.open('Failed to save', 'Close', { duration: 3000 });
        console.error(err);
      },
    });
  }
}
