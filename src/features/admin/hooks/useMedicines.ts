import { useState, useCallback, useEffect } from "react";
import apiClient from "@/lib/apiClient";

export interface MedicineResponse {
    id: string;
    laboratoryId: string;
    laboratoryName: string;
    brandName: string;
    genericName: string;
    composition: Record<string, object>;
    useFrom: string;
    atcCode: string;
}

export interface MedicineRequest {
    laboratoryId: string;
    brandName: string;
    genericName: string;
    composition: Record<string, object>;
    useFrom: string;
    atcCode: string;
}

export function useMedicines(search: string = "") {
    const [medicines, setMedicines] = useState<MedicineResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchMedicines = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            params.append("page", "0");
            params.append("size", "100");
            if (search.trim()) {
                params.append("search", search.trim());
            }
            const res = await apiClient.get(`/medicines?${params.toString()}`);
            setMedicines(res.data?.data || []);
        } catch (err: any) {
            console.error(err);
            setError("No se pudo cargar el catálogo de medicamentos.");
        } finally {
            setIsLoading(false);
        }
    }, [search]);

    useEffect(() => {
        fetchMedicines();
    }, [fetchMedicines]);

    const createMedicine = async (request: MedicineRequest) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.post("/medicines", request);

            if (res.status !== 200 && res.status !== 201) {
                throw new Error(res.data?.message || "Error al crear el medicamento");
            }

            await fetchMedicines();
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Ocurrió un error inesperado.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateMedicine = async (id: string, request: MedicineRequest) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.put(`/medicines/${id}`, request);

            if (res.status !== 200) {
                throw new Error(res.data?.message || "Error al actualizar el medicamento");
            }

            await fetchMedicines();
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || err.message || "Ocurrió un error inesperado.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteMedicine = async (id: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.delete(`/medicines/${id}`);

            if (res.status !== 200 && res.status !== 204) throw new Error("Error al eliminar el medicamento.");

            setMedicines(prev => prev.filter(m => m.id !== id));
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "No se pudo eliminar el medicamento.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { medicines, isLoading, isSubmitting, error, createMedicine, updateMedicine, deleteMedicine, refetch: fetchMedicines };
}