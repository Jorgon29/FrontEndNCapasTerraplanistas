import { useState, useEffect, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export interface Prescription {
    id: string;
    appointmentId: string;
    medicineId: string;
    medicineSnapshot: {
        brandName?: string;
        genericName?: string;
        atcCode?: string;
    };
    dosageInstructions: string;
    digitalSignature: string;
    usageCount: number;
    maxUsages: number;
    createdAt: string;
    createdBy: string;
}

export interface PrescriptionFilters {
    fromDate?: string;
    toDate?: string;
    doctorId?: string;
}

export function usePatientPrescriptions(patientId: string, filters?: PrescriptionFilters) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPrescriptions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get(`/prescriptions/patient/${patientId}`);
            let data = res.data?.data || [];

            if (filters?.fromDate) {
                const from = new Date(filters.fromDate);
                data = data.filter((p: Prescription) => new Date(p.createdAt) >= from);
            }
            if (filters?.toDate) {
                const to = new Date(filters.toDate);
                to.setHours(23, 59, 59, 999);
                data = data.filter((p: Prescription) => new Date(p.createdAt) <= to);
            }

            setPrescriptions(data);
        } catch (err: any) {
            console.error(err);
            setError("No se pudieron cargar las recetas.");
        } finally {
            setIsLoading(false);
        }
    }, [patientId, filters?.fromDate, filters?.toDate]);

    useEffect(() => {
        fetchPrescriptions();
    }, [fetchPrescriptions]);

    const dispensePrescription = async (prescriptionId: string) => {
        try {
            const res = await apiClient.patch(`/prescriptions/${prescriptionId}/dispense`);
            if (res.status === 200) {
                setPrescriptions(prev => prev.map(p =>
                    p.id === prescriptionId
                        ? { ...p, usageCount: res.data.data.usageCount }
                        : p
                ));
                return true;
            }
            return false;
        } catch (err: any) {
            throw err;
        }
    };

    return { prescriptions, isLoading, error, refetch: fetchPrescriptions, dispensePrescription };
}