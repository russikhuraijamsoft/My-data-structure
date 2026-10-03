export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'PROBATION';
export type Department = 'FRONT_OF_HOUSE' | 'KITCHEN' | 'MANAGEMENT' | 'HR' | 'FINANCE' | 'MAINTENANCE';
export type LeaveType = 'CASUAL' | 'SICK' | 'EARNED' | 'MATERNITY' | 'UNPAID';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY';

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  designation: string;
  dateOfJoining: string;
  status: EmployeeStatus;
  basicSalary: number;
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  clockIn?: string;
  clockOut?: string;
  status: AttendanceStatus;
  overtimeHours: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  month: number;
  year: number;
  basicPay: number;
  hra: number;
  allowances: number;
  incentives: number;
  overtimePay: number;
  grossEarnings: number;
  epfDeduction: number;
  esiDeduction: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
  netPay: number;
  status: 'DRAFT' | 'PAID';
  processedOn?: string;
}
