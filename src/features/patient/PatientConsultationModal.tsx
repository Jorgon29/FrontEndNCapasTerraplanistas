import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faFileMedical, faPills, faNotesMedical, faXmark, faSpinner, faWarning, faCheck } from "@fortawesome/free-solid-svg-icons";
import type { Appointment } from "@/features/utils/Appointment";
import apiClient from "@/lib/apiClient";
import { useCancelAppointment } from "@/features/payment";
import type MedicalRecord from "../utils/MedicalRecord";
import type Prescription from "../utils/Prescription";

interface PatientConsultationModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

function SectionHeader({ icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs">
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-text/70">{label}</h3>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-0.5">{label}</p>
      <p className="text-sm text-text leading-relaxed">{value}</p>
    </div>
  );
}


function ActiveView({ appointment, onCancel }: { appointment: Appointment; onCancel: () => void }) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const cancelAppointment = useCancelAppointment();

  const handleCancel = async () => {
    if (!appointment.id) return;
    try {
      await cancelAppointment.mutateAsync(appointment.id);
      setShowCancelConfirm(false);
      onCancel();
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert("Error al cancelar la cita. Por favor intenta de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-6 p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl">
        <FontAwesomeIcon icon={faVideo} />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-text mb-1">
          Consulta con {appointment.doctor_name}
        </h3>
        <p className="text-sm text-text-muted">
          {new Date(appointment.expected_at).toLocaleString("es-SV", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>
      </div>
      {appointment.notes && (
        <p className="text-sm text-text-muted italic text-center max-w-sm">
          "{appointment.notes}"
        </p>
      )}
      <a
        href={appointment.meeting_link}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
      >
        <FontAwesomeIcon icon={faVideo} /> Unirse a la videollamada
      </a>

      {!showCancelConfirm ? (
        <button
          onClick={() => setShowCancelConfirm(true)}
          className="text-sm text-red-400 hover:text-red-300 transition-colors cursor-pointer"
        >
          Cancelar cita
        </button>
      ) : (
        <div className="w-full max-w-sm rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center">
          <p className="text-sm text-red-400 mb-3 flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faWarning} />
            ¿Estás seguro de cancelar?
          </p>
          <p className="text-xs text-text-muted mb-3">
            Se realizará un reembolso del 80% del monto pagado.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowCancelConfirm(false)}
              className="flex-1 bg-surface-alt text-text rounded-lg py-2 text-xs font-medium hover:bg-surface-alt/80 transition-colors cursor-pointer"
            >
              No, mantener cita
            </button>
            <button
              onClick={handleCancel}
              disabled={cancelAppointment.isPending}
              className="flex-1 bg-red-500 text-white rounded-lg py-2 text-xs font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {cancelAppointment.isPending ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Cancelando...
                </>
              ) : (
                "Sí, cancelar"
              )}
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm rounded-xl border border-surface-alt bg-surface p-3">
        <p className="text-[10px] uppercase tracking-wider text-text-muted mb-1">Enlace alternativo</p>
        <a
          href={appointment.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="break-all font-mono text-xs text-primary hover:underline"
        >
          {appointment.meeting_link}
        </a>
      </div>
    </div>
  );
}


function CompletedView({ appointment }: { appointment: Appointment }) {
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [dispensingId, setDispensingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      try {
        const [recRes, preRes] = await Promise.all([
          apiClient.get(`/medical-records/appointment/${appointment.id}`),
          apiClient.get(`/prescriptions/appointment/${appointment.id}`),
        ]);
        if (recRes.status === 200) setRecord(recRes.data?.data);
        if (preRes.status === 200) setPrescriptions(preRes.data?.data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [appointment.id]);

  const handleDispense = async (prescriptionId: string) => {
    if (!confirm("¿Dispensar esta receta?")) return;
    setDispensingId(prescriptionId);
    try {
      const res = await apiClient.patch(`/prescriptions/${prescriptionId}/dispense`);
      if (res.status === 200) {
        setPrescriptions(prev => prev.map(p =>
          p.id === prescriptionId
            ? { ...p, usageCount: res.data.data.usageCount }
            : p
        ));
      }
    } catch {
      alert("Error al dispensar la receta");
    } finally {
      setDispensingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* medical record */}
      {record ? (
        <div className="rounded-xl border border-surface-alt bg-surface p-4 space-y-3">
          <SectionHeader icon={faFileMedical} label="Historia Clínica" />
          <Field label="Código CIE-10" value={record.diagnosisCode} />
          <Field label="Diagnóstico" value={record.diagnosisDescription} />
          <Field label="Examen Físico" value={record.physicalExamination} />
          <Field label="Notas Clínicas" value={record.clinicalNotes} />
          {record.followUpNote && (
            <div className="rounded-lg bg-accent/5 border border-accent/20 p-3">
              <SectionHeader icon={faNotesMedical} label="Nota de Seguimiento" />
              <p className="text-sm text-text leading-relaxed">{record.followUpNote}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-surface-alt bg-surface p-4 text-sm text-text-muted italic">
          No se encontró un registro clínico para esta consulta.
        </div>
      )}

      {/* prescriptions */}
      <div className="rounded-xl border border-surface-alt bg-surface p-4">
        <SectionHeader icon={faPills} label="Recetas Médicas" />
        {prescriptions.length === 0 ? (
          <p className="text-sm text-text-muted italic">No se emitieron recetas en esta consulta.</p>
        ) : (
          <div className="space-y-3">
            {prescriptions.map((p) => {
              const remaining = (p.maxUsages || 3) - (p.usageCount || 0);
              const isExhausted = remaining <= 0;

              return (
                <div key={p.id} className="rounded-lg border border-surface-alt p-3 space-y-2">
                  <p className="text-sm font-semibold text-text">
                    {p.medicineSnapshot?.brandName || p.medicineName || "Medicamento"}
                  </p>
                  <p className="text-xs text-text-muted">{p.dosageInstructions}</p>
                  <div className="flex items-center justify-between">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${isExhausted ? "text-red-500" : "text-accent"}`}>
                      {remaining} de {p.maxUsages || 3} usos disponibles
                    </p>
                    <button
                      onClick={() => handleDispense(p.id)}
                      disabled={isExhausted || dispensingId === p.id}
                      className={`text-xs px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        isExhausted
                          ? "bg-surface-alt text-text-muted cursor-not-allowed"
                          : "bg-primary/10 text-primary hover:bg-primary/20"
                      }`}
                    >
                      {dispensingId === p.id ? (
                        <FontAwesomeIcon icon={faSpinner} spin />
                      ) : isExhausted ? (
                        "Sin usos"
                      ) : (
                        <><FontAwesomeIcon icon={faCheck} className="mr-1" /> Usar</>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}

export default function PatientConsultationModal({ appointment, onClose }: PatientConsultationModalProps) {
  if (!appointment) return null;

  const isCompleted = appointment.status === "COMPLETED";

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background text-text rounded-2xl w-full max-w-xl flex flex-col overflow-hidden shadow-2xl border border-surface-alt"
        style={{ maxHeight: "85vh" }}>

        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt shrink-0">
          <div>
            <h2 className="text-base font-semibold text-text">
              {isCompleted ? "Resumen de consulta" : "Consulta programada"}
            </h2>
            <p className="text-xs text-text-muted mt-0.5">
              {appointment.doctor_name} ·{" "}
              <span className={isCompleted ? "text-success" : "text-primary"}>
                {isCompleted ? "Completada" : "Pendiente"}
              </span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        {isCompleted
          ? <CompletedView appointment={appointment} />
          : <ActiveView appointment={appointment} onCancel={onClose} />
        }

      </div>
    </div>
  );
}
