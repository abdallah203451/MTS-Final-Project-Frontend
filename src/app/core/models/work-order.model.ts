export interface WorkOrderDTO {
  workOrderId: number;
  title: string;
  description: string;
  customerName: string;
  customerMobile: string;
  customerEmail: string;
  customerAddress: string;
  proposedSchedulingDate: string; // date format
  createdAt: string; // date-time format
  createdById: number;
  createdByName: string;
  status: string;
}

export interface WorkOrderCreateDTO {
  title: string;
  description?: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  proposedSchedulingDate: string; // date format
}

export interface WorkOrderUpdateDTO {
  description?: string;
  customerName: string;
  customerMobile: string;
  customerEmail?: string;
  customerAddress?: string;
  proposedSchedulingDate: string; // date format
}

export interface WorkOrderSearchCriteria {
  q?: string;
  status?: string;
  fromDate?: string; // date format
  toDate?: string; // date format
}

export interface PageWorkOrderDTO {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  content: WorkOrderDTO[];
  number: number;
  sort: SortObject;
  pageable: PageableObject;
  empty: boolean;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  paged: boolean;
  unpaged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface SortObject {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}