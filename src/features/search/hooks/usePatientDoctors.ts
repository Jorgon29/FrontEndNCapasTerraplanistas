import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export interface PublicSpecialty {
    specialtyId: string;
    code: string;
    name: string;
    professionalLicenseNumber: string;
    feePerHour: number;
    consultDurationMinutes: number;
    availability: PublicAvailability[];
}

export interface PublicAvailability {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
}

export interface PublicDoctor {
    id: string;
    firstName: string;
    lastName: string;
    roleCode: string;
    specialties: PublicSpecialty[];
}

interface PageResponse {
    content: PublicDoctor[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export function usePatientDoctors(search?: string, page: number = 0, size: number = 20) {
    const [doctors, setDoctors] = useState<PublicDoctor[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    const fetchDoctors = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params: Record<string, string | number> = { page, size };
            if (search) {
                params.name = search;
                params.specialty = search;
            }

            const res = await apiClient.get<PageResponse>("/doctors", { params });
            setDoctors(res.data.content || []);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.number);
        } catch (err: any) {
            console.error("Error fetching doctors:", err);
            setError(err.response?.data?.message || "No se pudo cargar la lista de doctores");
        } finally {
            setIsLoading(false);
        }
    }, [search, page, size]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    return {
        doctors,
        isLoading,
        error,
        refetch: fetchDoctors,
        totalPages,
        currentPage,
    };
}