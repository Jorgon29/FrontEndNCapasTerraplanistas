import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export interface MedicalRecord {
    id: string;
    patientId: string;
    appointmentId: string;
    employeeId: string;
    doctorName: string;
    createdAt: string;
    diagnosisCode: string;
    diagnosisDescription: string;
    clinicalNotes: string;
    physicalExamination: string;
    attachments: string[];
}

export interface MedicalRecordFilters {
    fromDate?: string;
    toDate?: string;
    doctorId?: string;
}

export function usePatientMedicalRecords(filters?: MedicalRecordFilters) {
    const [records, setRecords] = useState<MedicalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters?.fromDate) params.append("fromDate", filters.fromDate);
            if (filters?.toDate) params.append("toDate", filters.toDate);
            if (filters?.doctorId) params.append("doctorId", filters.doctorId);

            const res = await apiClient.get(`/medical-records/patient${params.toString() ? '?' + params.toString() : ''}`);
            const rawRecords = Array.isArray(res.data?.data) ? res.data.data : [];
            const cleanedRecords = rawRecords.map((r: any) => ({
                ...r,
                attachments: r.attachments || []
            }));
            setRecords(cleanedRecords);
        } catch (err: any) {
            console.error(err);
            setError("No se pudieron cargar los registros médicos.");
        } finally {
            setIsLoading(false);
        }
    }, [filters?.fromDate, filters?.toDate, filters?.doctorId]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    return { records, isLoading, error, refetch: fetchRecords };
}