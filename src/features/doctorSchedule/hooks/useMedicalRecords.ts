import type { Appointment } from "@/features/utils/Appointment";
import { useConsultation } from "../providers/ConsultationProvider";
import { useState } from "react";
import apiClient from "@/lib/apiClient";

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
            ? "/medical-records/followup"
            : "/medical-records";

        try {
            const response = await apiClient.post(endpoint, payload);

            if (response.status !== 200 && response.status !== 201) throw new Error("Error al guardar el historial médico");
            setMessage({ type: "success", text: "¡Historial Clínico guardado exitosamente!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Error de red" });
        } finally {
            setSubmitting(false);
        }
    };

    return { form, setForm, submitting, handleSubmit };
}