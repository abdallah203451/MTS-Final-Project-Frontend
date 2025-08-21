import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AssignmentCreateDTO,
  AssignmentDTO,
  DaySlotsDTO,
  ReassignmentDTO,
} from '../models/assignment.model';

@Injectable({
  providedIn: 'root',
})
export class AssignmentService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get assignment by work order ID
  getAssignmentByWorkOrderId(workOrderId: number): Observable<AssignmentDTO> {
    return this.http.get<AssignmentDTO>(
      `${this.apiUrl}/assignments/work-order/${workOrderId}`
    );
  }

  // Create assignment
  createAssignment(assignment: AssignmentCreateDTO): Observable<AssignmentDTO> {
    return this.http.post<AssignmentDTO>(
      `${this.apiUrl}/assignments/assign`,
      assignment
    );
  }

  // Reassign work order
  reassignWorkOrder(reassignment: ReassignmentDTO): Observable<AssignmentDTO> {
    return this.http.post<AssignmentDTO>(
      `${this.apiUrl}/assignments/reassign`,
      reassignment
    );
  }

  // // Get available dates
  // getAvailableDates(workOrderId: number): Observable<DaySlotsDTO[]> {
  //   return this.http.get<DaySlotsDTO[]>(`${this.apiUrl}/assignments/available-dates`);
  // }

  getAvailableDates(workOrderId?: number): Observable<string[]> {
    let params = new HttpParams();
    if (workOrderId != null) {
      params = params.set('workOrderId', String(workOrderId));
    }
    return this.http.get<string[]>(
      `${this.apiUrl}/assignments/available-dates`,
      { params }
    );
  }
}
