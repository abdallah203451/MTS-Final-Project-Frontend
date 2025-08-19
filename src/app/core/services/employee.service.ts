import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AvailableEmployeeDTO, CreateTechnicianDTO, EmployeeDTO } from '../models/employee.model';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees(): Observable<EmployeeDTO[]> {
    return this.http.get<EmployeeDTO[]>(`${this.apiUrl}/employees`);
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(`${this.apiUrl}/employees/${id}`);
  }

  // Create technician
  createTechnician(technician: CreateTechnicianDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(`${this.apiUrl}/employees/technicians`, technician);
  }

  // Get available employees for a specific date
  getAvailableEmployees(date: string): Observable<AvailableEmployeeDTO[]> {
    return this.http.get<AvailableEmployeeDTO[]>(`${this.apiUrl}/assignment-controller/getAvailableEmployees?date=${date}`);
  }
}