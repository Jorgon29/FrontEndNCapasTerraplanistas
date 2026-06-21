import type { Appointment } from "@/features/utils/Appointment";
import { useConsultation } from "../providers/ConsultationProvider";
import { useState } from "react";
import BASE_URL from "@/config/config";

export interface MedicalRecordForm {
  diagnosisCode: string;
  diagnosisDescription: string;
  clinicalNotes: string;
  physicalExamination: string;
  attachments: string[];
}

export function useMedicalRecord(appointment: Appointment) {
  const { setMessage } = useConsultation();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<MedicalRecordForm>({
    diagnosisCode: "",
    diagnosisDescription: "",
    clinicalNotes: "",
    physicalExamination: "",
    attachments: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    const payload = {
      patientId:    appointment.patient_id,
      appointmentId: appointment.id,
      employeeId:   appointment.employee_id,
      diagnosisCode: form.diagnosisCode,
      diagnosisDescription: form.diagnosisDescription,
      clinicalNotes: form.clinicalNotes,
      physicalExamination: form.physicalExamination || undefined,
      attachments: form.attachments,
    };

    try {
      const response = await fetch(`${BASE_URL}/api/medical-records`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Error al guardar el historial médico");

      setMessage({ type: "success", text: "¡Historial Clínico guardado exitosamente!" });
      setForm({
        diagnosisCode: "",
        diagnosisDescription: "",
        clinicalNotes: "",
        physicalExamination: "",
        attachments: [],
      });
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Error de red" });
    } finally {
      setSubmitting(false);
    }
  };

  return { form, setForm, submitting, handleSubmit };
}