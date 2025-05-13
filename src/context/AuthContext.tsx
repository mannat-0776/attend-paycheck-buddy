
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { v4 as uuidv4 } from "uuid";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  provider: "email";
  createdAt: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signupWithEmail: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const STORAGE_KEY_AUTH = "attendpay-auth";

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Load user data from localStorage on initial load
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (savedAuth) {
        setUser(JSON.parse(savedAuth));
      }
    } catch (error) {
      console.error("Error loading auth data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Simple mock of email/password login
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      const usersStr = localStorage.getItem("attendpay-users") || "[]";
      const users = JSON.parse(usersStr);
      
      const foundUser = users.find((u: any) => 
        u.email === email && u.password === password
      );
      
      if (!foundUser) {
        throw new Error("Invalid email or password");
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${userWithoutPassword.name}!`,
      });
      
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simple mock of email signup
  const signupWithEmail = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call to your backend
      const usersStr = localStorage.getItem("attendpay-users") || "[]";
      const users = JSON.parse(usersStr);
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error("Email already in use");
      }
      
      const newUser = {
        id: uuidv4(),
        name,
        email,
        password, // In a real app, this would be hashed
        provider: "email" as const,
        createdAt: new Date().toISOString(),
      };
      
      users.push(newUser);
      localStorage.setItem("attendpay-users", JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Signup successful",
        description: `Welcome, ${name}!`,
      });
      
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signupWithEmail,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
