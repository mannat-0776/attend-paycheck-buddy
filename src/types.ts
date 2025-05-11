
export interface Employee {
  id: string;
  name: string;
  position: string;
  email: string;
  phoneNumber: string;
  dailySalary: number;
  joiningDate: string;
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
