import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
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
import { CreateTechnicianDTO } from '../../../core/models/employee.model';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatChip } from '@angular/material/chips';

@Component({
  selector: 'app-technician-create',
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
    MatProgressSpinner,
    MatChip,
  ],
  templateUrl: './technician-create.component.html',
  styleUrls: ['./technician-create.component.css'],
})
export class TechnicianCreateComponent {
  form = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    phoneNumber: new FormControl(''),
  });
  saving = false;
  hidePassword = true;

  constructor(
    private svc: EmployeeService,
    public router: Router,
    private snack: MatSnackBar
  ) {}

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;

    // Build a typed DTO explicitly to satisfy TypeScript
    const dto: CreateTechnicianDTO = {
      name: this.form.get('name')!.value as string,
      email: this.form.get('email')!.value as string,
      password: this.form.get('password')!.value as string,
      phoneNumber: (this.form.get('phoneNumber')!.value as string) || undefined,
    };

    this.svc.createTechnician(dto).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Technician created', 'OK', { duration: 2500 });
        this.router.navigate(['/technicians']);
      },
      error: (err) => {
        this.saving = false;
        this.snack.open('Failed to create', 'Close', { duration: 3000 });
        console.error(err);
      },
    });
  }
}
