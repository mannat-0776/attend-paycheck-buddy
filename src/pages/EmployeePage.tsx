
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/AppContext";
import { Layout } from "@/components/Layout";
import { Employee } from "@/types";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const EmployeePage = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useAppContext();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState<Omit<Employee, "id">>({
    name: "",
    position: "",
    email: "",
    phoneNumber: "",
    dailySalary: 0,
    joiningDate: new Date().toISOString().split("T")[0],
    employeeIdNumber: "",
  });
  
  const handleAddEmployee = () => {
    addEmployee(newEmployee);
    setNewEmployee({
      name: "",
      position: "",
      email: "",
      phoneNumber: "",
      dailySalary: 0,
      joiningDate: new Date().toISOString().split("T")[0],
      employeeIdNumber: "",
    });
    setIsAddDialogOpen(false);
  };
  
  const handleUpdateEmployee = () => {
    if (currentEmployee) {
      updateEmployee(currentEmployee.id, currentEmployee);
      setIsEditDialogOpen(false);
    }
  };
  
  const handleDeleteEmployee = () => {
    if (currentEmployee) {
      deleteEmployee(currentEmployee.id);
      setIsDeleteDialogOpen(false);
    }
  };
  
  return (
    <Layout>
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Employees</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newEmployee.name}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, name: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newEmployee.position}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, position: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newEmployee.email}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, email: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={newEmployee.phoneNumber}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, phoneNumber: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="employeeIdNumber">Employee ID</Label>
                  <Input
                    id="employeeIdNumber"
                    value={newEmployee.employeeIdNumber || ""}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, employeeIdNumber: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dailySalary">Daily Salary</Label>
                  <Input
                    id="dailySalary"
                    type="number"
                    value={newEmployee.dailySalary}
                    onChange={(e) =>
                      setNewEmployee({
                        ...newEmployee,
                        dailySalary: parseFloat(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input
                    id="joiningDate"
                    type="date"
                    value={newEmployee.joiningDate}
                    onChange={(e) =>
                      setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddEmployee}>Add</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {employees.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No employees found. Add your first employee.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {employees.map((employee) => (
              <Card key={employee.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-primary/10 p-4">
                    <h3 className="text-xl font-semibold">{employee.name}</h3>
                    <p className="text-gray-600">{employee.position}</p>
                    {employee.employeeIdNumber && (
                      <p className="text-gray-500 text-sm mt-1">ID: {employee.employeeIdNumber}</p>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Daily Salary:</span>
                      <span className="font-semibold">${employee.dailySalary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span>{employee.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phone:</span>
                      <span>{employee.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Joined:</span>
                      <span>{new Date(employee.joiningDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setCurrentEmployee(employee);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          setCurrentEmployee(employee);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      {/* Edit Employee Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
          </DialogHeader>
          {currentEmployee && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={currentEmployee.name}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-position">Position</Label>
                <Input
                  id="edit-position"
                  value={currentEmployee.position}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      position: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentEmployee.email}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                <Input
                  id="edit-phoneNumber"
                  value={currentEmployee.phoneNumber}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      phoneNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-employeeIdNumber">Employee ID</Label>
                <Input
                  id="edit-employeeIdNumber"
                  value={currentEmployee.employeeIdNumber || ""}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      employeeIdNumber: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-dailySalary">Daily Salary</Label>
                <Input
                  id="edit-dailySalary"
                  type="number"
                  value={currentEmployee.dailySalary}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      dailySalary: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-joiningDate">Joining Date</Label>
                <Input
                  id="edit-joiningDate"
                  type="date"
                  value={currentEmployee.joiningDate}
                  onChange={(e) =>
                    setCurrentEmployee({
                      ...currentEmployee,
                      joiningDate: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmployee}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {currentEmployee?.name}'s data and all associated attendance records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteEmployee}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default EmployeePage;
