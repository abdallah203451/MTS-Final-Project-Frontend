import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName = 'Guest';
  isAdmin = false;
  isSidenavOpen = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || user.email || 'User';
      // backend role was 'TeamLeader' or 'Technician' — check TeamLeader
      this.isAdmin = user.role === 'TeamLeader' || user.role === 'ADMIN';
    } else {
      // fallback: subscribe to auth changes
      this.authService.isAuthenticated$.subscribe((ok) => {
        if (ok) {
          const u = this.authService.getCurrentUser();
          if (u) {
            this.userName = u.name || u.email;
            this.isAdmin = u.role === 'TeamLeader' || u.role === 'ADMIN';
          }
        }
      });
    }
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
