import type { Appointment } from "@/features/utils/Appointment";
import { useConsultation } from "../providers/ConsultationProvider";
import { useState } from "react";
import BASE_URL from "@/config/config";

export function usePrescription(appointment: Appointment) {
    const { setMessage } = useConsultation();
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        medicines: [{ medicineId: "", medicineName: "", maxUsages: 3 }
        ],
        instructions: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            appointment: { id: appointment.id },
            medicines: form.medicines,
            createdBy: appointment.employee_id,
            instructions: form.instructions,
            digitalSignature: `SIG-${Date.now()}-${appointment.employee_id}`

        }

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

    const addMedicineRow = () =>
        setForm(f => ({ ...f, medicines: [...f.medicines, { medicineId: "", medicineName: "", maxUsages: 3 }] }));

    const removeMedicineRow = (index: number) =>
        setForm(f => ({ ...f, medicines: f.medicines.filter((_, i) => i !== index) }));

    const updateMedicineRow = (index: number, patch: Partial<typeof form.medicines[0]>) =>
        setForm(f => ({
            ...f,
            medicines: f.medicines.map((row, i) => i === index ? { ...row, ...patch } : row),
        }));

    return { form, setForm, submitting, handleSubmit, addMedicineRow, removeMedicineRow, updateMedicineRow };
}