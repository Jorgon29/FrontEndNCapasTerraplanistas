import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import type Patient from "@/features/utils/Patient";

export function usePatientProfile(initialPatient: Patient | null) {
    const { logout } = useAuth();

    const [formData, setFormData] = useState({
        first_name: initialPatient?.first_name || "",
        last_name: initialPatient?.last_name || "",
        phones: initialPatient?.phones || "",
        address: initialPatient?.address || "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                firstName: formData.first_name,
                lastName: formData.last_name,
                phones: formData.phones,
                address: formData.address,
            };

            const response = await apiClient.put("/auth/profile", payload);

            if (response.status !== 200) {
                throw new Error(response.data?.message || "Error al actualizar el perfil.");
            }

            setSuccess("¡Perfil actualizado con éxito!");
            
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado al actualizar.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            await apiClient.delete("/auth/profile");

            if (logout) {
                logout(); 
            } else {
                window.location.href = "/login";
            }

        } catch (err: any) {
            console.error(err);
            setError(err.message || "No se pudo eliminar la cuenta.");
            setIsDeleting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        isDeleting,
        error,
        success,
        handleChange,
        handleUpdate,
        handleDeleteAccount
    };
}