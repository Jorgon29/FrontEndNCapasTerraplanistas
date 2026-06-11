import type { Appointment } from "@/features/utils/Appointment";
import { useConsultation } from "../providers/ConsultationProvider";
import { useState } from "react";
import BASE_URL from "@/config/config";

export function usePrescription(appointment: Appointment) {
  const { setMessage } = useConsultation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    medicineId: "",
    dosageInstructions: "",
    maxUsages: 3,
  });

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            appointment: { id: appointment.id },
            medicine: { id: Number(form.medicineId) },
            medicineSnapshot: { name: "Mock Medicine Name", category: "General" },
            dosageInstructions: form.dosageInstructions,
            maxUsages: form.maxUsages,
            createdBy: appointment.employee_id,
            digitalSignature: `SIG-${Date.now()}-${appointment.employee_id}`,
            //lo que haga falta
        };

        try {
            const response = await fetch(`${BASE_URL}/api/prescriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Error al emitir la receta");
            setMessage({ type: "success", text: "¡Receta médica emitida y firmada!" });
        } catch (err: any) {
            setMessage({ type: "error", text: err.message || "Error de red" });
        } finally {
            setSubmitting(false);
        }
    };

      return { form, setForm, submitting, handleSubmit };
}