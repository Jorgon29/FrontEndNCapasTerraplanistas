import { useState, useCallback, useEffect } from "react";
import apiClient from "@/lib/apiClient";

export interface LaboratoryResponse {
    id: string;
    name: string;
}

export function useLaboratories() {
    const [laboratories, setLaboratories] = useState<LaboratoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLaboratories = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await apiClient.get("/laboratories");
            setLaboratories(res.data?.data || []);
        } catch (err: any) {
            console.error(err);
            setError("No se pudo cargar el catálogo de laboratorios.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLaboratories();
    }, [fetchLaboratories]);

    const createLaboratory = async (name: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.post("/laboratories", { name });

            if (res.status !== 200 && res.status !== 201) {
                throw new Error(res.data?.message || "Error al crear el laboratorio");
            }

            await fetchLaboratories();
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateLaboratory = async (id: string, name: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.put(`/laboratories/${id}`, { name });

            if (res.status !== 200) {
                throw new Error(res.data?.message || "Error al actualizar el laboratorio");
            }

            await fetchLaboratories();
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteLaboratory = async (id: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await apiClient.delete(`/laboratories/${id}`);

            if (res.status !== 200 && res.status !== 204) throw new Error("Error al eliminar el laboratorio.");

            setLaboratories(prev => prev.filter(l => l.id !== id));
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "No se pudo eliminar el laboratorio.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { laboratories, isLoading, isSubmitting, error, createLaboratory, updateLaboratory, deleteLaboratory, refetch: fetchLaboratories };
}