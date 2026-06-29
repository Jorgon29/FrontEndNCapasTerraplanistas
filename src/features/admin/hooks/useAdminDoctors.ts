import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export interface AdminEmployee {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roleCode: string;
    status: string;
    isActive: boolean;
}

export function useAdminDoctors() {
    const [doctors, setDoctors] = useState<AdminEmployee[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctors = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get("/admin/employees");
            const employees = res.data || [];
            const doctorEmployees = employees.filter((emp: AdminEmployee) => emp.roleCode === "EMPLOYEE");
            setDoctors(doctorEmployees);
        } catch (err: any) {
            console.error("Error fetching doctors:", err);
            setError(err.response?.data?.message || "No se pudo cargar la lista de doctores");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    return {
        doctors,
        isLoading,
        error,
        refetch: fetchDoctors,
    };
}
