import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { Router, RouterModule } from '@angular/router';
import { EmployeeDTO } from '../../../core/models/employee.model';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-technician-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './technician-list.component.html',
  styleUrls: ['./technician-list.component.css'],
})
export class TechnicianListComponent implements OnInit {
  techs: EmployeeDTO[] = [];
  loading = false;

  constructor(
    private svc: EmployeeService,
    private router: Router,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.svc.getAllEmployees().subscribe({
      next: (list) => {
        this.techs = list.filter((x) => x.role === 'Technician');
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snack.open('Failed to load technicians');
      },
    });
  }

  create(): void {
    this.router.navigate(['/technicians/create']);
  }
  view(id: number): void {
    this.router.navigate(['/technicians', id]);
  }
}
