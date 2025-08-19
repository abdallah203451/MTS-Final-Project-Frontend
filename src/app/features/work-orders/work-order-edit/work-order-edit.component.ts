import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkOrderService } from '../../../core/services/work-order.service';
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

  constructor(
    private svc: WorkOrderService,
    private route: ActivatedRoute,
    public router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
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

  save(): void {
    if (this.form.invalid) return;
    this.saving = true;
    this.svc.updateWorkOrder(this.id, this.form.value).subscribe({
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
