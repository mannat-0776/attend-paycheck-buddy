
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Employee, AttendanceRecord, SalaryReport } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  salaryReports: SalaryReport[];
  
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  addAttendanceRecord: (record: Omit<AttendanceRecord, "id">) => void;
  updateAttendanceRecord: (id: string, record: Partial<AttendanceRecord>) => void;
  deleteAttendanceRecord: (id: string) => void;
  
  getAttendanceByEmployee: (employeeId: string) => AttendanceRecord[];
  getAttendanceByDate: (date: string) => AttendanceRecord[];
  
  calculateSalary: (employeeId: string, month: number, year: number) => number;
  generateSalaryReport: (month: number, year: number) => SalaryReport[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

const STORAGE_KEY_EMPLOYEES = 'attendpay-employees';
const STORAGE_KEY_ATTENDANCE = 'attendpay-attendance';
const STORAGE_KEY_SALARY = 'attendpay-salary';

export const AppProvider = ({ children }: AppProviderProps) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [salaryReports, setSalaryReports] = useState<SalaryReport[]>([]);
  const { toast } = useToast();
  
  // Load data from localStorage on initial load
  useEffect(() => {
    try {
      const savedEmployees = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
      if (savedEmployees) {
        setEmployees(JSON.parse(savedEmployees));
      }
      
      const savedAttendance = localStorage.getItem(STORAGE_KEY_ATTENDANCE);
      if (savedAttendance) {
        setAttendanceRecords(JSON.parse(savedAttendance));
      }
      
      const savedSalary = localStorage.getItem(STORAGE_KEY_SALARY);
      if (savedSalary) {
        setSalaryReports(JSON.parse(savedSalary));
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      toast({
        title: "Error",
        description: "Failed to load saved data.",
        variant: "destructive",
      });
    }
  }, [toast]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    }
  }, [employees]);
  
  useEffect(() => {
    if (attendanceRecords.length > 0) {
      localStorage.setItem(STORAGE_KEY_ATTENDANCE, JSON.stringify(attendanceRecords));
    }
  }, [attendanceRecords]);
  
  useEffect(() => {
    if (salaryReports.length > 0) {
      localStorage.setItem(STORAGE_KEY_SALARY, JSON.stringify(salaryReports));
    }
  }, [salaryReports]);
  
  const addEmployee = (employee: Omit<Employee, "id">) => {
    const newEmployee = {
      ...employee,
      id: uuidv4(),
    };
    setEmployees([...employees, newEmployee]);
    toast({
      title: "Employee Added",
      description: `${employee.name} has been added successfully.`,
    });
  };
  
  const updateEmployee = (id: string, updatedData: Partial<Employee>) => {
    setEmployees(
      employees.map((emp) =>
        emp.id === id ? { ...emp, ...updatedData } : emp
      )
    );
    toast({
      title: "Employee Updated",
      description: "Employee information has been updated successfully.",
    });
  };
  
  const deleteEmployee = (id: string) => {
    const employeeToDelete = employees.find(emp => emp.id === id);
    setEmployees(employees.filter((emp) => emp.id !== id));
    // Also delete related attendance records
    setAttendanceRecords(attendanceRecords.filter(record => record.employeeId !== id));
    toast({
      title: "Employee Deleted",
      description: employeeToDelete ? `${employeeToDelete.name} has been removed.` : "Employee has been removed.",
    });
  };
  
  const addAttendanceRecord = (record: Omit<AttendanceRecord, "id">) => {
    // Check if record already exists for this employee and date
    const existingRecord = attendanceRecords.find(
      (r) => r.employeeId === record.employeeId && r.date === record.date
    );
    
    if (existingRecord) {
      // Update the existing record instead
      updateAttendanceRecord(existingRecord.id, record);
      return;
    }
    
    const newRecord = {
      ...record,
      id: uuidv4(),
    };
    setAttendanceRecords([...attendanceRecords, newRecord]);
    toast({
      title: "Attendance Recorded",
      description: "Attendance has been marked successfully.",
    });
  };
  
  const updateAttendanceRecord = (id: string, updatedData: Partial<AttendanceRecord>) => {
    setAttendanceRecords(
      attendanceRecords.map((record) =>
        record.id === id ? { ...record, ...updatedData } : record
      )
    );
    toast({
      title: "Attendance Updated",
      description: "Attendance record has been updated.",
    });
  };
  
  const deleteAttendanceRecord = (id: string) => {
    setAttendanceRecords(attendanceRecords.filter((record) => record.id !== id));
    toast({
      title: "Attendance Deleted",
      description: "Attendance record has been deleted.",
    });
  };
  
  const getAttendanceByEmployee = (employeeId: string) => {
    return attendanceRecords.filter((record) => record.employeeId === employeeId);
  };
  
  const getAttendanceByDate = (date: string) => {
    return attendanceRecords.filter((record) => record.date === date);
  };
  
  const calculateSalary = (employeeId: string, month: number, year: number) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (!employee) return 0;
    
    const records = attendanceRecords.filter((record) => {
      const recordDate = new Date(record.date);
      return (
        record.employeeId === employeeId &&
        recordDate.getMonth() === month - 1 &&
        recordDate.getFullYear() === year
      );
    });
    
    let workDays = 0;
    
    records.forEach((record) => {
      switch (record.status) {
        case "present":
          workDays += 1;
          break;
        case "half-day":
          workDays += 0.5;
          break;
        case "leave":
        case "absent":
        default:
          break;
      }
    });
    
    return workDays * employee.dailySalary;
  };
  
  const generateSalaryReport = (month: number, year: number) => {
    const reports: SalaryReport[] = employees.map((employee) => {
      const records = attendanceRecords.filter((record) => {
        const recordDate = new Date(record.date);
        return (
          record.employeeId === employee.id &&
          recordDate.getMonth() === month - 1 &&
          recordDate.getFullYear() === year
        );
      });
      
      let workDays = 0;
      
      records.forEach((record) => {
        switch (record.status) {
          case "present":
            workDays += 1;
            break;
          case "half-day":
            workDays += 0.5;
            break;
          case "leave":
          case "absent":
          default:
            break;
        }
      });
      
      const totalSalary = workDays * employee.dailySalary;
      
      return {
        employeeId: employee.id,
        month,
        year,
        workDays,
        totalSalary,
      };
    });
    
    setSalaryReports([...salaryReports, ...reports]);
    return reports;
  };
  
  const value = {
    employees,
    attendanceRecords,
    salaryReports,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getAttendanceByEmployee,
    getAttendanceByDate,
    calculateSalary,
    generateSalaryReport,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
