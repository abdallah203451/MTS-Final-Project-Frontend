// src/app/app.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { filter, Subscription } from 'rxjs';

// Structural directive (for *ngIf) and Material modules
import { NgIf } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgIf,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'], // <-- fixed property name
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Workforce Management System';
  isAuthRoute = false;
  private sub?: Subscription;

  userName = 'Guest';
  isAdmin = false;
  isSidenavOpen = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // initial check
    this.checkUrl(this.router.url);

    // update flag on navigation end
    this.sub = this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((ev) => this.checkUrl(ev.urlAfterRedirects));

    // DO NOT force-navigate here every time. Let guards / routes handle redirect.
    // Instead only set user state if available:
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || user.email || 'User';
      this.isAdmin = user.role === 'TeamLeader' || user.role === 'ADMIN';
    } else {
      // fallback: update when authentication status changes
      this.authService.isAuthenticated$.subscribe((ok) => {
        if (ok) {
          const u = this.authService.getCurrentUser();
          if (u) {
            this.userName = u.name || u.email || 'User';
            this.isAdmin = u.role === 'TeamLeader' || u.role === 'ADMIN';
          }
        } else {
          this.userName = 'Guest';
          this.isAdmin = false;
        }
      });
    }
  }

  private checkUrl(url: string) {
    const path = url.split(/[?#]/)[0];
    this.isAuthRoute = path.startsWith('/auth');
  }

  toggleSidenav(): void {
    this.isSidenavOpen = !this.isSidenavOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
