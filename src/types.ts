
export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phoneNumber: string;
  dailySalary: number;
  joiningDate: string;
  employeeIdNumber?: string; // Added employee ID number field
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'half-day' | 'leave';

export interface SalaryReport {
  employeeId: string;
  month: number;
  year: number;
  workDays: number;
  totalSalary: number;
}

export interface User {
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  company: string;
}
