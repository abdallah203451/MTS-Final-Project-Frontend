export interface EmployeeDTO {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
}

export interface CreateTechnicianDTO {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface AvailableEmployeeDTO {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  availableSlots: number;
}