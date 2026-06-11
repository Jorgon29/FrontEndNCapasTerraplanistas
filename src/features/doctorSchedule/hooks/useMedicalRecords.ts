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
    });

  const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            patient: { id: appointment.patient_id },
            appointment: { id: appointment.id },
            employee: { id: appointment.employee_id },
            // lo que haga falta
        };

        try {
            const response = await fetch(`${BASE_URL}/api/medical-records`, {
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