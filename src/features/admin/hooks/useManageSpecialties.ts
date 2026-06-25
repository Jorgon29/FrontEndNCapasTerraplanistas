import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import type { Doctor, Speciality } from "@/features/utils/Employees";

export interface SpecialtyResponse {
    id: string;
    code: string;
    name: string;
}

export function useManageSpecialties(doctor: Doctor) {
    const [availableSpecialties, setAvailableSpecialties] = useState<SpecialtyResponse[]>([]);
    const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

    const [localDoctorSpecialties, setLocalDoctorSpecialties] = useState<Speciality[]>(doctor.specialties || []);

    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
    const [licenseNumber, setLicenseNumber] = useState(doctor.professional_license_number || "");
    const [feePerHour, setFeePerHour] = useState<number | "">("");
    const [consultDuration, setConsultDuration] = useState<number | "">(30);
    const [shiftJSON, setShiftJSON] = useState('{\n  "description": "Morning Shift"\n}');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await apiClient.get("/specialty");
                setAvailableSpecialties(res.data || []);
                
                if (res.data.data && res.data.data.length > 0) {
                    setSelectedSpecialtyId(res.data.data[0].id);
                }
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar el catálogo de especialidades.");
            } finally {
                setIsLoadingCatalog(false);
            }
        };
        fetchSpecialties();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        let shiftMap;
        try {
            shiftMap = JSON.parse(shiftJSON);
        } catch {
            setError("El formato del turno (Shift) debe ser un JSON válido.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            employeeId: doctor.id,
            specialtyId: selectedSpecialtyId,
            professionalLicenseNumber: licenseNumber,
            feePerHour: Number(feePerHour),
            shift: shiftMap,
            consultDurationMinutes: Number(consultDuration)
        };

        try {
            const response = await apiClient.post("/admin/employees/specialties", payload);

            if (response.status !== 200 && response.status !== 201) {
                throw new Error(response.data?.message || "Error al asignar especialidad");
            }

            const addedSpecCatalog = availableSpecialties.find(s => s.id === selectedSpecialtyId);
            setLocalDoctorSpecialties(prev => [
                ...prev,
                {
                    id: selectedSpecialtyId,
                    name: addedSpecCatalog?.name || "Nueva Especialidad",
                    licence: licenseNumber,
                    feePerHour: Number(feePerHour),
                    duration: Number(consultDuration),
                    officeHours: []
                }
            ]);

            setFeePerHour("");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Ocurrió un error inesperado.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRemove = async (specialtyId: string) => {
        if (!confirm("¿Está seguro de remover esta especialidad del médico?")) return;
        
        try {
            const response = await apiClient.delete(`/admin/employees/${doctor.id}/specialties/${specialtyId}`);

            if (response.status !== 200 && response.status !== 204) throw new Error("Error removiendo especialidad");

            setLocalDoctorSpecialties(prev => prev.filter(s => s.id !== specialtyId));
        } catch (err) {
            console.error(err);
            alert("No se pudo remover la especialidad.");
        }
    };

    return {
        availableSpecialties,
        isLoadingCatalog,
        localDoctorSpecialties,
        formState: {
            selectedSpecialtyId, setSelectedSpecialtyId,
            licenseNumber, setLicenseNumber,
            feePerHour, setFeePerHour,
            consultDuration, setConsultDuration,
            shiftJSON, setShiftJSON
        },
        isSubmitting,
        error,
        handleAdd,
        handleRemove
    };
}