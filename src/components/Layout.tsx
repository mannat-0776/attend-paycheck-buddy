
import { ReactNode } from "react";
import { NavBar } from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="container mx-auto px-4">
        {children}
      </main>
      <footer className="mt-auto py-4 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Employee Attendance Manager</p>
      </footer>
    </div>
  );
};
