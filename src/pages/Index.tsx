
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center space-y-8 py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-primary">Employee Attendance Manager</h1>
          <p className="text-xl text-gray-600 max-w-xl">
            Track employee attendance and calculate salaries based on work days
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <DashboardCard 
            title="Employees"
            description="Manage employee profiles and information"
            buttonText="Manage Employees"
            onClick={() => navigate("/employees")}
            icon="👥"
          />
          
          <DashboardCard 
            title="Attendance"
            description="Track daily attendance for employees"
            buttonText="Mark Attendance"
            onClick={() => navigate("/attendance")}
            icon="📅"
          />
          
          <DashboardCard 
            title="Salary Reports"
            description="View and generate salary reports"
            buttonText="View Reports"
            onClick={() => navigate("/reports")}
            icon="💰"
          />
        </div>
      </div>
    </Layout>
  );
};

interface DashboardCardProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  icon: string;
}

const DashboardCard = ({ title, description, buttonText, onClick, icon }: DashboardCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center text-center transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500 mb-4">{description}</p>
      <Button 
        onClick={onClick}
        className="mt-auto"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default Index;
