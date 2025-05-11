
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <NavLink to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">AttendPay</span>
            </NavLink>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center space-x-2">
            <NavItem to="/">Dashboard</NavItem>
            <NavItem to="/employees">Employees</NavItem>
            <NavItem to="/attendance">Attendance</NavItem>
            <NavItem to="/reports">Reports</NavItem>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" onClick={toggleMobileMenu} size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 pt-2 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              <MobileNavItem to="/" onClick={toggleMobileMenu}>Dashboard</MobileNavItem>
              <MobileNavItem to="/employees" onClick={toggleMobileMenu}>Employees</MobileNavItem>
              <MobileNavItem to="/attendance" onClick={toggleMobileMenu}>Attendance</MobileNavItem>
              <MobileNavItem to="/reports" onClick={toggleMobileMenu}>Reports</MobileNavItem>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

interface NavItemProps {
  to: string;
  children: React.ReactNode;
}

const NavItem = ({ to, children }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "px-3 py-2 rounded-md text-sm font-medium text-white bg-primary"
          : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      }
    >
      {children}
    </NavLink>
  );
};

interface MobileNavItemProps {
  to: string;
  children: React.ReactNode;
  onClick: () => void;
}

const MobileNavItem = ({ to, children, onClick }: MobileNavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "px-3 py-2 block rounded-md text-sm font-medium text-white bg-primary"
          : "px-3 py-2 block rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};
