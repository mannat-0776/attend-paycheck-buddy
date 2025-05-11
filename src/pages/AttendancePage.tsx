
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Employee, AttendanceStatus } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const AttendancePage = () => {
  const { employees, attendanceRecords, addAttendanceRecord, getAttendanceByDate } = useAppContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTab, setSelectedTab] = useState<"daily" | "employee">("daily");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("");
  const [employeeAttendance, setEmployeeAttendance] = useState<Record<string, { status: AttendanceStatus; notes: string }>>({});
  
  useEffect(() => {
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const records = getAttendanceByDate(dateStr);
      
      const attendanceMap: Record<string, { status: AttendanceStatus; notes: string }> = {};
      
      // Initialize with employees
      employees.forEach(employee => {
        attendanceMap[employee.id] = { status: 'absent', notes: '' };
      });
      
      // Update with existing records
      records.forEach(record => {
        attendanceMap[record.employeeId] = { 
          status: record.status, 
          notes: record.notes || '' 
        };
      });
      
      setEmployeeAttendance(attendanceMap);
    }
  }, [selectedDate, employees, attendanceRecords, getAttendanceByDate]);
  
  const handleAttendanceChange = (employeeId: string, status: AttendanceStatus) => {
    setEmployeeAttendance(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        status
      }
    }));
  };
  
  const handleNotesChange = (employeeId: string, notes: string) => {
    setEmployeeAttendance(prev => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        notes
      }
    }));
  };
  
  const saveAttendance = () => {
    if (!selectedDate) return;
    
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    Object.entries(employeeAttendance).forEach(([employeeId, data]) => {
      addAttendanceRecord({
        employeeId,
        date: dateStr,
        status: data.status,
        notes: data.notes,
      });
    });
  };
  
  return (
    <Layout>
      <div className="py-6 space-y-6">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        
        <Tabs value={selectedTab} onValueChange={(value) => setSelectedTab(value as "daily" | "employee")}>
          <TabsList className="mb-4">
            <TabsTrigger value="daily">Daily Attendance</TabsTrigger>
            <TabsTrigger value="employee">Employee History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <Card className="md:col-span-4">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                  <p className="mt-2 text-center">
                    {selectedDate ? format(selectedDate, "EEEE, MMMM d, yyyy") : "Select a date"}
                  </p>
                </CardContent>
              </Card>
              
              <div className="md:col-span-8 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Mark Attendance - {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {employees.length === 0 ? (
                      <p className="text-center py-4">No employees found. Add employees first.</p>
                    ) : (
                      <div className="space-y-6">
                        {employees.map((employee) => (
                          <div key={employee.id} className="border rounded-lg p-4 space-y-3">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <h3 className="text-lg font-medium">{employee.name}</h3>
                                <p className="text-sm text-gray-500">{employee.position}</p>
                              </div>
                              <div className="flex-1 md:max-w-xs">
                                <RadioGroup 
                                  value={employeeAttendance[employee.id]?.status || 'absent'}
                                  onValueChange={(value) => handleAttendanceChange(employee.id, value as AttendanceStatus)}
                                  className="flex space-x-2"
                                >
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="present" id={`present-${employee.id}`} />
                                    <Label htmlFor={`present-${employee.id}`}>Present</Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="absent" id={`absent-${employee.id}`} />
                                    <Label htmlFor={`absent-${employee.id}`}>Absent</Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="half-day" id={`half-${employee.id}`} />
                                    <Label htmlFor={`half-${employee.id}`}>Half-day</Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="leave" id={`leave-${employee.id}`} />
                                    <Label htmlFor={`leave-${employee.id}`}>Leave</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`notes-${employee.id}`} className="text-sm">Notes</Label>
                              <Textarea 
                                id={`notes-${employee.id}`}
                                placeholder="Any additional notes..."
                                value={employeeAttendance[employee.id]?.notes || ''}
                                onChange={(e) => handleNotesChange(employee.id, e.target.value)}
                                className="mt-1"
                              />
                            </div>
                          </div>
                        ))}
                        <div className="flex justify-end">
                          <Button onClick={saveAttendance}>Save Attendance</Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle>Employee Attendance History</CardTitle>
              </CardHeader>
              <CardContent>
                {employees.length === 0 ? (
                  <p className="text-center py-4">No employees found. Add employees first.</p>
                ) : (
                  <div className="space-y-4">
                    <div className="mb-4">
                      <Label htmlFor="select-employee" className="mb-2 block">Select Employee</Label>
                      <Select
                        value={selectedEmployeeId}
                        onValueChange={setSelectedEmployeeId}
                      >
                        <SelectTrigger id="select-employee">
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {selectedEmployeeId && (
                      <EmployeeAttendanceHistory employeeId={selectedEmployeeId} />
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

interface EmployeeAttendanceHistoryProps {
  employeeId: string;
}

const EmployeeAttendanceHistory = ({ employeeId }: EmployeeAttendanceHistoryProps) => {
  const { employees, getAttendanceByEmployee } = useAppContext();
  const employee = employees.find(emp => emp.id === employeeId);
  const attendanceRecords = getAttendanceByEmployee(employeeId);
  
  // Sort records by date (newest first)
  const sortedRecords = [...attendanceRecords].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  if (!employee) {
    return <p>Employee not found.</p>;
  }
  
  if (sortedRecords.length === 0) {
    return <p>No attendance records found for {employee.name}.</p>;
  }
  
  const getStatusBadgeClass = (status: AttendanceStatus) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800";
      case "absent":
        return "bg-red-100 text-red-800";
      case "half-day":
        return "bg-yellow-100 text-yellow-800";
      case "leave":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">{employee.name}'s Attendance History</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecords.map((record) => (
              <tr key={record.id} className="border-b">
                <td className="px-4 py-2">
                  {format(new Date(record.date), "MMM d, yyyy")}
                  <span className="block text-xs text-gray-500">
                    {format(new Date(record.date), "EEEE")}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  {record.notes || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePage;
