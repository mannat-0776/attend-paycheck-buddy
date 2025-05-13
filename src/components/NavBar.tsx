
import { Button } from "@/components/ui/button";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, UserCircle, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleLogout = () => {
    logout();
    navigate("/auth");
  };
  
  const handleLogin = () => {
    navigate("/auth");
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
            {isAuthenticated ? (
              <>
                <NavItem to="/">Dashboard</NavItem>
                <NavItem to="/employees">Employees</NavItem>
                <NavItem to="/attendance">Attendance</NavItem>
                <NavItem to="/reports">Reports</NavItem>
                <NavItem to="/profile">
                  <UserCircle className="h-4 w-4 mr-1" />
                  {user?.name || "Profile"}
                </NavItem>
                <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button onClick={handleLogin} size="sm">
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Button>
            )}
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
              {isAuthenticated ? (
                <>
                  <MobileNavItem to="/" onClick={toggleMobileMenu}>Dashboard</MobileNavItem>
                  <MobileNavItem to="/employees" onClick={toggleMobileMenu}>Employees</MobileNavItem>
                  <MobileNavItem to="/attendance" onClick={toggleMobileMenu}>Attendance</MobileNavItem>
                  <MobileNavItem to="/reports" onClick={toggleMobileMenu}>Reports</MobileNavItem>
                  <MobileNavItem to="/profile" onClick={toggleMobileMenu}>
                    <UserCircle className="h-4 w-4 mr-1" />
                    {user?.name || "Profile"}
                  </MobileNavItem>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => {
                      toggleMobileMenu();
                      handleLogout();
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  className="w-full justify-start" 
                  onClick={() => {
                    toggleMobileMenu();
                    handleLogin();
                  }}
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              )}
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
          ? "px-3 py-2 rounded-md text-sm font-medium text-white bg-primary flex items-center"
          : "px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
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
          ? "px-3 py-2 block rounded-md text-sm font-medium text-white bg-primary flex items-center"
          : "px-3 py-2 block rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 flex items-center"
      }
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
};
