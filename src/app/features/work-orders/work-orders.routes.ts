import { Routes } from '@angular/router';
import { WorkOrderListComponent } from './work-order-list/work-order-list.component';
import { WorkOrderDetailComponent } from './work-order-detail/work-order-detail.component';
import { WorkOrderCreateComponent } from './work-order-create/work-order-create.component';
import { WorkOrderAssignmentComponent } from './work-order-assignment/work-order-assignment.component';
import { WorkOrderEditComponent } from './work-order-edit/work-order-edit.component';

export const WORK_ORDERS_ROUTES: Routes = [
  {
    path: '',
    component: WorkOrderListComponent,
    title: 'Work Orders',
  },
  {
    path: 'create',
    component: WorkOrderCreateComponent,
    title: 'Create Work Order',
  },
  {
    path: ':id',
    component: WorkOrderDetailComponent,
    title: 'Work Order Details',
  },
  {
    path: ':id/edit',
    component: WorkOrderEditComponent,
    title: 'Work Order Edit',
  },
  {
    path: ':id/assign',
    component: WorkOrderAssignmentComponent,
    title: 'Assign Work Order',
  },
];
