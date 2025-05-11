
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

const ReportsPage = () => {
  const { employees, generateSalaryReport } = useAppContext();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [salaryData, setSalaryData] = useState<any[]>([]);
  const [generatedOn, setGeneratedOn] = useState<Date | null>(null);
  
  const handleGenerateReport = () => {
    const report = generateSalaryReport(month, year);
    setSalaryData(
      report.map((item) => {
        const employee = employees.find((e) => e.id === item.employeeId);
        return {
          ...item,
          employeeName: employee?.name || "Unknown",
          position: employee?.position || "",
        };
      })
    );
    setGeneratedOn(new Date());
  };
  
  // Generate array of months and years for select inputs
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
  
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  
  return (
    <Layout>
      <div className="py-6 space-y-6">
        <h1 className="text-3xl font-bold">Salary Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate Monthly Salary Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1">
                <Label htmlFor="select-month">Month</Label>
                <Select
                  value={month.toString()}
                  onValueChange={(value) => setMonth(parseInt(value))}
                >
                  <SelectTrigger id="select-month">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value.toString()}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Label htmlFor="select-year">Year</Label>
                <Select
                  value={year.toString()}
                  onValueChange={(value) => setYear(parseInt(value))}
                >
                  <SelectTrigger id="select-year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateReport} className="w-full md:w-auto">
                  Generate Report
                </Button>
              </div>
            </div>
            
            {generatedOn && (
              <div className="mb-2 text-sm text-gray-500">
                Report generated on {format(generatedOn, "PPpp")}
              </div>
            )}
            
            {salaryData.length > 0 ? (
              <div className="overflow-x-auto rounded-md border">
                <table className="min-w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Employee</th>
                      <th className="px-4 py-2 text-left font-medium">Position</th>
                      <th className="px-4 py-2 text-left font-medium">Work Days</th>
                      <th className="px-4 py-2 text-left font-medium">Total Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {salaryData.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                        <td className="px-4 py-3">{item.employeeName}</td>
                        <td className="px-4 py-3">{item.position}</td>
                        <td className="px-4 py-3">{item.workDays}</td>
                        <td className="px-4 py-3 font-medium">${item.totalSalary.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="px-4 py-3 font-medium text-right">
                        Total:
                      </td>
                      <td className="px-4 py-3 font-medium">
                        ${salaryData.reduce((total, item) => total + item.totalSalary, 0).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              employees.length > 0 ? (
                <div className="py-8 text-center text-gray-500">
                  Generate a report to view salary data.
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  No employees found. Add employees to generate salary reports.
                </div>
              )
            )}
          </CardContent>
        </Card>
        
        {salaryData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Individual Employee Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {salaryData.map((item, index) => (
                  <div key={index} className="border rounded-lg overflow-hidden">
                    <div className="bg-primary/10 p-4">
                      <h3 className="text-lg font-medium">{item.employeeName}</h3>
                      <p className="text-sm text-gray-500">{item.position}</p>
                    </div>
                    <div className="p-4 grid gap-2">
                      <div className="grid grid-cols-2 gap-2 py-1 border-b">
                        <span className="text-gray-500">Month & Year:</span>
                        <span className="font-medium">{months.find(m => m.value === month)?.label} {year}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 py-1 border-b">
                        <span className="text-gray-500">Work Days:</span>
                        <span className="font-medium">{item.workDays} days</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 py-1 border-b">
                        <span className="text-gray-500">Daily Salary:</span>
                        <span className="font-medium">${employees.find(e => e.id === item.employeeId)?.dailySalary.toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 py-1">
                        <span className="text-gray-500">Total Salary:</span>
                        <span className="font-medium">${item.totalSalary.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default ReportsPage;
