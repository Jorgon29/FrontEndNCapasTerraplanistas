import { useState, useCallback, useEffect } from "react";
import BASE_URL from "@/config/config";
import type { SpecialtyResponse } from "./useManageSpecialties";

export function useGlobalSpecialties() {
    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSpecialties = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/specialty`);
            if (!res.ok) throw new Error("Error fetching specialties");
            const json = await res.json();
            setSpecialties(json.data || []);
        } catch (err: any) {
            console.error(err);
            setError("No se pudo cargar el catálogo de especialidades.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpecialties();
    }, [fetchSpecialties]);

    const createSpecialty = async (code: string, name: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/specialty`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code, name }),
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => null);
                throw new Error(errData?.message || "Error al crear la especialidad");
            }
            
            await fetchSpecialties();
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteSpecialty = async (id: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const res = await fetch(`${BASE_URL}/specialty/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) throw new Error("Error al eliminar la especialidad. Verifique que no esté asignada a médicos.");

            setSpecialties(prev => prev.filter(s => s.id !== id));
            return true;
        } catch (err: any) {
            console.error(err);
            setError(err.message || "No se pudo eliminar la especialidad.");
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    return { specialties, isLoading, isSubmitting, error, createSpecialty, deleteSpecialty };
}