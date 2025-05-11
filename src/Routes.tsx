
import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import Index from "./pages/Index";
import EmployeePage from "./pages/EmployeePage";
import AttendancePage from "./pages/AttendancePage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/employees" element={<EmployeePage />} />
      <Route path="/attendance" element={<AttendancePage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="*" element={<NotFound />} />
    </ReactRouterRoutes>
  );
};

export default Routes;
