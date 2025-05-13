
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppContext } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { SalaryReport } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Download, Printer } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { PaytmReceipt } from "@/components/PaytmReceipt";

const ReportsPage = () => {
  const { employees, attendanceRecords, generateSalaryReport } = useAppContext();
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reports, setReports] = useState<SalaryReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<SalaryReport | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  
  const receiptRef = useRef<HTMLDivElement>(null);
  
  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: `Salary-Receipt-${selectedReport?.month}-${selectedReport?.year}`,
  });
  
  const handleGenerateReports = () => {
    const generatedReports = generateSalaryReport(month, year);
    setReports(generatedReports);
  };
  
  const handleViewReceipt = (report: SalaryReport) => {
    setSelectedReport(report);
    setIsReceiptOpen(true);
  };
  
  const getMonthName = (monthNumber: number) => {
    return new Date(0, monthNumber - 1).toLocaleString('default', { month: 'long' });
  };
  
  return (
    <Layout>
      <div className="py-6 space-y-6">
        <h1 className="text-3xl font-bold">Salary Reports</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Generate Monthly Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Month</label>
                <Select value={month.toString()} onValueChange={(value) => setMonth(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                      <SelectItem key={m} value={m.toString()}>
                        {getMonthName(m)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Year</label>
                <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                      <SelectItem key={y} value={y.toString()}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleGenerateReports} className="w-full">
                  Generate Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {reports.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>{getMonthName(month)} {year} Salary Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted">
                      <th className="text-left p-2 border">Employee</th>
                      <th className="text-left p-2 border">Position</th>
                      <th className="text-left p-2 border">Work Days</th>
                      <th className="text-left p-2 border">Total Salary</th>
                      <th className="text-left p-2 border">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports.map((report) => {
                      const employee = employees.find((e) => e.id === report.employeeId);
                      return (
                        <tr key={report.employeeId} className="border-b">
                          <td className="p-2 border">{employee?.name || "Unknown"}</td>
                          <td className="p-2 border">{employee?.position || "Unknown"}</td>
                          <td className="p-2 border">{report.workDays}</td>
                          <td className="p-2 border">${report.totalSalary.toFixed(2)}</td>
                          <td className="p-2 border">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewReceipt(report)}
                            >
                              View Receipt
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Paytm Receipt Dialog */}
        <Dialog open={isReceiptOpen} onOpenChange={setIsReceiptOpen}>
          <DialogContent className="sm:max-w-4xl">
            <DialogHeader>
              <DialogTitle>Salary Receipt</DialogTitle>
              <div className="flex space-x-2 absolute right-8 top-8">
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </DialogHeader>
            <div className="p-0 overflow-auto max-h-[80vh]">
              {selectedReport && (
                <PaytmReceipt ref={receiptRef} salaryReport={selectedReport} />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ReportsPage;
