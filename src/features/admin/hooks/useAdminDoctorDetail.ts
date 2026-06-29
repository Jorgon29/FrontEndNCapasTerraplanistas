import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export interface AvailabilitySlot {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface SpecialtyDetail {
    specialtyId: string;
    code: string;
    name: string;
    professionalLicenseNumber: string;
    feePerHour: number;
    consultDurationMinutes: number;
    availabilities: AvailabilitySlot[];
}

export interface DoctorDetail {
    id: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    roleCode: string;
    status: string;
    phones: string;
    address: string;
    specialties: SpecialtyDetail[];
}

export function useAdminDoctorDetail(doctorId: string) {
    const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDoctor = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/admin/employees/${doctorId}/detail`);
            setDoctor(res.data);
        } catch (err: any) {
            console.error("Error fetching doctor detail:", err);
            setError(err.response?.data?.message || "No se pudo cargar la información del doctor");
        } finally {
            setIsLoading(false);
        }
    }, [doctorId]);

    useEffect(() => {
        fetchDoctor();
    }, [fetchDoctor]);

    const updateDoctor = async (data: Partial<DoctorDetail>) => {
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                phones: (data as any).phones || "",
                address: (data as any).address || "",
            };
            const res = await apiClient.put(`/admin/employees/${doctorId}`, payload);
            setDoctor(res.data);
            return true;
        } catch (err: any) {
            console.error("Error updating doctor:", err);
            setError(err.response?.data?.message || "No se pudo actualizar");
            return false;
        }
    };

    const addSpecialty = async (specialtyId: string, licenseNumber: string) => {
        try {
            await apiClient.post(`/admin/employees/${doctorId}/specialties`, {
                specialtyId,
                professionalLicenseNumber: licenseNumber,
            });
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error adding specialty:", err);
            setError(err.response?.data?.message || "No se pudo agregar la especialidad");
            return false;
        }
    };

    const removeSpecialty = async (specialtyId: string) => {
        try {
            await apiClient.delete(`/admin/employees/${doctorId}/specialties/${specialtyId}`);
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error removing specialty:", err);
            setError(err.response?.data?.message || "No se pudo eliminar la especialidad");
            return false;
        }
    };

    const updateSpecialty = async (
        specialtyId: string,
        professionalLicenseNumber: string,
        feePerHour: number,
        consultDurationMinutes: number
    ): Promise<boolean> => {
        try {
            await apiClient.put(
                `/admin/employees/${doctorId}/specialties/${specialtyId}`,
                { professionalLicenseNumber, feePerHour, consultDurationMinutes }
            );
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error updating specialty:", err);
            setError(err.response?.data?.message || "No se pudo actualizar la especialidad");
            return false;
        }
    };

    const addAvailability = async (
        employeeId: string,
        specialtyId: string,
        dayOfWeek: string,
        startTime: string,
        endTime: string
    ): Promise<boolean> => {
        try {
            await apiClient.post(
                `/admin/employees/${employeeId}/specialties/${specialtyId}/availability`,
                { dayOfWeek, startTime, endTime }
            );
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error adding availability:", err);
            setError(err.response?.data?.message || "No se pudo agregar el horario");
            return false;
        }
    };

    const revokeAccess = async () => {
        try {
            await apiClient.delete(`/admin/employees/${doctorId}`);
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error revoking access:", err);
            setError(err.response?.data?.message || "No se pudo revocar el acceso");
            return false;
        }
    };

    const reactivate = async () => {
        try {
            await apiClient.post(`/admin/employees/${doctorId}/reactivate`);
            await fetchDoctor();
            return true;
        } catch (err: any) {
            console.error("Error reactivating:", err);
            setError(err.response?.data?.message || "No se pudo reactiviar");
            return false;
        }
    };

    return {
        doctor,
        isLoading,
        error,
        refetch: fetchDoctor,
        updateDoctor,
        addSpecialty,
        updateSpecialty,
        removeSpecialty,
        addAvailability,
        revokeAccess,
        reactivate,
    };
}
