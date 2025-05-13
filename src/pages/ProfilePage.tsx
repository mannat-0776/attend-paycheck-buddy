
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Layout } from "@/components/Layout";
import { User } from "@/types";
import { useAppContext } from "@/context/AppContext";
import { Save, Download } from "lucide-react";

const ProfilePage = () => {
  const { saveData, downloadData, user, updateUser } = useAppContext();
  const { toast } = useToast();
  const [profile, setProfile] = useState<User>(user || {
    name: "",
    email: "",
    role: "admin",
    company: ""
  });

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
              <p className="text-sm text-gray-500">
                Save your data to browser storage or download it as a JSON file for backup.
              </p>
              
              <div className="grid gap-4">
                <Button onClick={handleSaveData} variant="outline" className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Data
                </Button>
                
                <Button onClick={handleDownloadData} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download Data
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
