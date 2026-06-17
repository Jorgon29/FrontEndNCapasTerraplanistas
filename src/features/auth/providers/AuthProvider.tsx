import type { Doctor, Employee } from "@/features/utils/Employees";
import type Patient from "@/features/utils/Patient";
import {
  createContext,
  useContext,
  useState,
  useEffect
} from "react";
import type { ReactNode } from "react";

interface AuthContextValue {
  patient: Patient | null;
  doctor: Doctor | null;
  admin: Employee | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [admin, setAdmin] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedPatient = localStorage.getItem("auth-patient");
      const storedDoctor = localStorage.getItem("auth-doctor");
      const storedAdmin = localStorage.getItem("auth-admin");

      if (storedPatient) setPatient(JSON.parse(storedPatient));
      if (storedDoctor) setDoctor(JSON.parse(storedDoctor));
      if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    } catch (error) {
      console.error("Error loading session data, purging corrupted entries:", error);
      localStorage.removeItem("auth-patient");
      localStorage.removeItem("auth-doctor");
      localStorage.removeItem("auth-admin");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isAuthenticated = !!patient || !!doctor || !!admin;

  const value: AuthContextValue = {
    patient,
    doctor,
    admin,
    isLoading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;