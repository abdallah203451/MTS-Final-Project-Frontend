import { Routes } from '@angular/router';
import { TechnicianListComponent } from './technician-list/technician-list.component';
import { TechnicianDetailComponent } from './technician-detail/technician-detail.component';
import { TechnicianCreateComponent } from './technician-create/technician-create.component';

export const TECHNICIANS_ROUTES: Routes = [
  {
    path: '',
    component: TechnicianListComponent,
    title: 'Technicians'
  },
  {
    path: 'create',
    component: TechnicianCreateComponent,
    title: 'Create Technician'
  },
  {
    path: ':id',
    component: TechnicianDetailComponent,
    title: 'Technician Details'
  }
];