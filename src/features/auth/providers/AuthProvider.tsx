import { ENV } from "@/config/config";
import type { Doctor, Employee } from "@/features/utils/Employees";
import type Patient from "@/features/utils/Patient";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from "react";
import type { ReactNode } from "react";
import { authStorage, AuthUser } from "@/lib/authStorage";
import apiClient from "@/lib/apiClient";

interface PatientApiResponse {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phones: string;
  userId: string;
}

const mapApiResponseToPatient = (data: PatientApiResponse): Patient => ({
  id: data.id,
  first_name: data.firstName,
  last_name: data.lastName,
  phones: data.phones || "",
  address: data.address || "",
  userId: data.userId,
});

interface AuthContextValue {
  patient: Patient | null;
  doctor: Doctor | null;
  admin: Employee | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  user: AuthUser | null;
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
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = useCallback(async () => {
    try {
      const refreshToken = authStorage.getRefreshToken();
      if (refreshToken) {
        await apiClient.post("/auth/logout", {}, {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      authStorage.clearTokens();
      setPatient(null);
      setDoctor(null);
      setAdmin(null);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        if (authStorage.hasValidToken()) {
          const storedUser = authStorage.getUser();
          if (storedUser) {
            setUser(storedUser);

            if (storedUser.roles.includes("USER") || storedUser.roles.includes("PATIENT")) {
              try {
                const response = await apiClient.get<PatientApiResponse>("/patient/me");
                setPatient(mapApiResponseToPatient(response.data));
              } catch (error) {
                console.error("Error fetching patient profile:", error);
                setPatient(null);
              }
            }

            if (storedUser.roles.includes("EMPLOYEE")) {
              const doctorData: Doctor = {
                id: storedUser.id,
                firstName: storedUser.name.split(" ")[0] || storedUser.name,
                lastName: storedUser.name.split(" ")[1] || "",
                email: storedUser.email,
                specialtyId: "",
                professionalLicense: "",
              };
              setDoctor(doctorData);
            }

            if (storedUser.roles.includes("ADMIN")) {
              const adminData: Employee = {
                id: storedUser.id,
                firstName: storedUser.name.split(" ")[0] || storedUser.name,
                lastName: storedUser.name.split(" ")[1] || "",
                email: storedUser.email,
              };
              setAdmin(adminData);
            }
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        authStorage.clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    const handleAuthChange = async (event: CustomEvent) => {
      if (event.detail) {
        const { user } = event.detail;
        setUser(user);

        if (user.roles.includes("USER") || user.roles.includes("PATIENT")) {
          try {
            const response = await apiClient.get<PatientApiResponse>("/patient/me");
            setPatient(mapApiResponseToPatient(response.data));
          } catch (error) {
            console.error("Error fetching patient profile:", error);
            setPatient(null);
          }
          setDoctor(null);
          setAdmin(null);
        } else if (user.roles.includes("EMPLOYEE")) {
          const doctorData: Doctor = {
            id: user.id,
            firstName: user.name.split(" ")[0] || user.name,
            lastName: user.name.split(" ")[1] || "",
            email: user.email,
            specialtyId: "",
            professionalLicense: "",
          };
          setDoctor(doctorData);
          setPatient(null);
          setAdmin(null);
        } else if (user.roles.includes("ADMIN")) {
          const adminData: Employee = {
            id: user.id,
            firstName: user.name.split(" ")[0] || user.name,
            lastName: user.name.split(" ")[1] || "",
            email: user.email,
          };
          setAdmin(adminData);
          setPatient(null);
          setDoctor(null);
        }
      } else {
        setUser(null);
        setPatient(null);
        setDoctor(null);
        setAdmin(null);
      }
    };

    loadUserFromStorage();

    const unsubscribe = authStorage.subscribeToAuthChanges(handleAuthChange as EventListener);

    return unsubscribe;
  }, []);

  const isAuthenticated = !!user && authStorage.hasValidToken();

  const value: AuthContextValue = {
    patient,
    doctor,
    admin,
    isLoading,
    isAuthenticated,
    logout,
    user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
