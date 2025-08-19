export interface AssignmentDTO {
  assignmentId: number;
  workOrderId: number;
  employeeId: number;
  workDate: string; // date format
  intervalId: number;
  intervalLabel: string;
  assignedAt: string; // date-time format
  assignedById: number;
}

export interface AssignmentCreateDTO {
  workOrderId: number;
  employeeId: number;
}

export interface ReassignmentDTO {
  workOrderId: number;
  newEmployeeId: number;
}

export interface DaySlotsDTO {
  date: string; // date format
  intervals: IntervalSlotDTO[];
}

export interface IntervalSlotDTO {
  intervalId: number;
  label: string;
  available: boolean;
}