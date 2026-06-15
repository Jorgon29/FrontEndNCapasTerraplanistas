import type { Appointment } from "@/features/utils/Appointment";
import { useConsultation } from "../providers/ConsultationProvider";
import { useState } from "react";
import BASE_URL from "@/config/config";

export function useMedicalRecord(appointment: Appointment) {
    const { setMessage } = useConsultation();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        diagnosisCode: "",
        diagnosisDescription: "",
        clinicalNotes: "",
        physicalExamination: "",
        followUpNote: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const isCompleted = appointment.status === "COMPLETED";

        const payload = isCompleted
            ? {
                appointment: { id: appointment.id },
                followUpNote: form.followUpNote,
                ...(form.diagnosisCode && { diagnosisCode: form.diagnosisCode }),
                ...(form.clinicalNotes && { clinicalNotes: form.clinicalNotes }),
            }
            : {
                patient: { id: appointment.patient_id },
                appointment: { id: appointment.id },
                employee: { id: appointment.employee_id },
                ...form,
            };

        const endpoint = isCompleted
            ? `${BASE_URL}/api/medical-records/followup`
            : `${BASE_URL}/api/medical-records`;

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Error al guardar el historial médico");
            setMessage({ type: "success", text: "¡Historial Clínico guardado exitosamente!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Error de red" });
        } finally {
            setSubmitting(false);
        }
    };

    return { form, setForm, submitting, handleSubmit };
}