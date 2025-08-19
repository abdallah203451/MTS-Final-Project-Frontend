import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrderCreateDTO } from '../../../core/models/work-order.model';

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
  ],
  templateUrl: './work-order-create.component.html',
  styleUrls: ['./work-order-create.component.css'],
})
export class WorkOrderCreateComponent {
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl(''),
    customerName: new FormControl('', Validators.required),
    customerMobile: new FormControl('', Validators.required),
    customerEmail: new FormControl('', Validators.email),
    customerAddress: new FormControl(''),
    proposedSchedulingDate: new FormControl('', Validators.required),
  });

  saving = false;

  constructor(
    private svc: WorkOrderService,
    public router: Router,
    private snack: MatSnackBar
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;

    // Build typed DTO explicitly (avoid Partial<T> issues)
    const dto: WorkOrderCreateDTO = {
      title: this.form.get('title')!.value as string,
      description: (this.form.get('description')!.value as string) || undefined,
      customerName: this.form.get('customerName')!.value as string,
      customerMobile: this.form.get('customerMobile')!.value as string,
      customerEmail:
        (this.form.get('customerEmail')!.value as string) || undefined,
      customerAddress:
        (this.form.get('customerAddress')!.value as string) || undefined,
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

  public navigateToWorkOrders(): void {
    this.router.navigate(['/work-orders']);
  }
}
