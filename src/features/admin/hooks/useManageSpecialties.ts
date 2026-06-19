import { useState, useEffect } from "react";
import BASE_URL from "@/config/config";
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
                const res = await fetch(`${BASE_URL}/specialty`);
                if (!res.ok) throw new Error("Error fetching specialties");
                const json = await res.json();
                setAvailableSpecialties(json.data || []);
                
                if (json.data && json.data.length > 0) {
                    setSelectedSpecialtyId(json.data[0].id);
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
            const response = await fetch(`${BASE_URL}/admin/employees/specialties`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => null);
                throw new Error(errData?.message || "Error al asignar especialidad");
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
            const response = await fetch(`${BASE_URL}/admin/employees/${doctor.id}/specialties/${specialtyId}`, {
                method: "DELETE"
            });

            if (!response.ok) throw new Error("Error removiendo especialidad");

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