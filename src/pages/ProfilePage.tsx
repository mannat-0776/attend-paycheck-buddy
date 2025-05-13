
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/Layout";
import { User } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { Save, Download, Upload, RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ProfilePage = () => {
  const { saveData, downloadData, user, updateUser, employees, attendanceRecords, salaryReports } = useAppContext();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User>(user || {
    name: "",
    email: "",
    role: "admin",
    company: ""
  });
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [jsonData, setJsonData] = useState("");

  const handleSaveProfile = () => {
    updateUser(profile);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };

  const handleSaveData = () => {
    saveData();
    toast({
      title: "Data Saved",
      description: "All application data has been saved to your browser.",
    });
  };

  const handleDownloadData = () => {
    downloadData();
    toast({
      title: "Data Downloaded",
      description: "All application data has been downloaded as JSON.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsedData = JSON.parse(result);
        setJsonData(result);
        toast({
          title: "File Loaded",
          description: "JSON file has been loaded. Review and click Import to apply.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Invalid JSON file format.",
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportData = () => {
    try {
      // This is a mock implementation - in a real app you would save to a server/database
      localStorage.setItem('attendpay-import-data', jsonData);
      setShowImportDialog(false);
      toast({
        title: "Data Imported",
        description: "Please refresh the page to see imported data.",
      });
      // Force a page reload to apply the imported data
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: "Could not import data. Please try again.",
      });
    }
  };

  const getDataSummary = () => {
    return {
      employees: employees.length,
      attendance: attendanceRecords.length,
      reports: salaryReports.length
    };
  };

  const dataSummary = getDataSummary();

  return (
    <Layout>
      <div className="py-6 space-y-6">
        <h1 className="text-3xl font-bold">Profile</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={profile.name} 
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={profile.email} 
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input 
                  id="company" 
                  value={profile.company} 
                  onChange={(e) => setProfile({...profile, company: e.target.value})}
                />
              </div>
              
              <Button onClick={handleSaveProfile} className="w-full">
                Save Profile
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <h3 className="font-medium mb-2">Current Data Summary</h3>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between">
                    <span>Employees:</span>
                    <span className="font-medium">{dataSummary.employees}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Attendance Records:</span>
                    <span className="font-medium">{dataSummary.attendance}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Salary Reports:</span>
                    <span className="font-medium">{dataSummary.reports}</span>
                  </li>
                </ul>
              </div>
              
              <div className="grid gap-4">
                <Button onClick={handleSaveData} variant="outline" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Data (Browser Storage)
                </Button>
                
                <Button onClick={handleDownloadData} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Data (JSON)
                </Button>

                <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Import Data
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Import Data</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <p className="text-sm text-muted-foreground">
                        Upload a JSON file to import employee, attendance, and salary data.
                      </p>
                      <div className="space-y-2">
                        <Label htmlFor="importFile">Select JSON File</Label>
                        <Input 
                          id="importFile" 
                          type="file" 
                          accept=".json" 
                          onChange={handleFileUpload}
                        />
                      </div>
                      {jsonData && (
                        <div className="bg-muted p-3 rounded text-xs overflow-auto max-h-36">
                          <pre>{jsonData.substring(0, 200)}...</pre>
                        </div>
                      )}
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setShowImportDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleImportData}
                          disabled={!jsonData}
                        >
                          Import
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="secondary" className="w-full" onClick={() => window.location.reload()}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Application
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
