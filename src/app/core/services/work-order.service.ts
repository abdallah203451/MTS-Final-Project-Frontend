import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PageWorkOrderDTO, WorkOrderCreateDTO, WorkOrderDTO, WorkOrderSearchCriteria, WorkOrderUpdateDTO } from '../models/work-order.model';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  private apiUrl = `${environment.apiUrl}/work-orders`;

  constructor(private http: HttpClient) {}

  // Get all work orders with pagination and search criteria
  getWorkOrders(page: number = 0, size: number = 10, searchCriteria?: WorkOrderSearchCriteria): Observable<PageWorkOrderDTO> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (searchCriteria) {
      if (searchCriteria.q) {
        params = params.set('q', searchCriteria.q);
      }
      if (searchCriteria.status) {
        params = params.set('status', searchCriteria.status);
      }
      if (searchCriteria.fromDate) {
        params = params.set('fromDate', searchCriteria.fromDate);
      }
      if (searchCriteria.toDate) {
        params = params.set('toDate', searchCriteria.toDate);
      }
    }

    return this.http.get<PageWorkOrderDTO>(this.apiUrl, { params });
  }

  // Get work order by ID
  getWorkOrderById(id: number): Observable<WorkOrderDTO> {
    return this.http.get<WorkOrderDTO>(`${this.apiUrl}/${id}`);
  }

  // Create work order
  createWorkOrder(workOrder: WorkOrderCreateDTO): Observable<WorkOrderDTO> {
    return this.http.post<WorkOrderDTO>(this.apiUrl, workOrder);
  }

  // Update work order
  updateWorkOrder(id: number, workOrder: WorkOrderUpdateDTO): Observable<WorkOrderDTO> {
    return this.http.put<WorkOrderDTO>(`${this.apiUrl}/${id}`, workOrder);
  }

  // Delete work order
  deleteWorkOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}