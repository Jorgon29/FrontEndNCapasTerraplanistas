import { useConsultation } from "../providers/ConsultationProvider";
import { useMedicalRecord } from "../hooks/useMedicalRecords";

function MedicalRecordForm() {
  const { appointment } = useConsultation();
  const { form, setForm, submitting, handleSubmit } = useMedicalRecord(appointment!);

  const isCompleted = appointment?.status === "COMPLETED";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {isCompleted && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400">
          Esta consulta ya fue completada. Solo puedes agregar una nota de seguimiento y opcionalmente corregir el registro clínico.
        </div>
      )}

      {isCompleted && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
            Nota de Seguimiento
          </label>
          <textarea
            required
            rows={3}
            placeholder="Escriba la nota de seguimiento para el paciente..."
            className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
            value={form.followUpNote}
            onChange={e => setForm({ ...form, followUpNote: e.target.value })}
          />
        </div>
      )}

      <details open={!isCompleted} className={isCompleted ? "border border-primary-light/20 rounded-xl p-3" : ""}>
        {isCompleted && (
          <summary className="text-xs font-bold uppercase tracking-wider text-text/70 cursor-pointer mb-3">
            Corrección de Registro Clínico (opcional)
          </summary>
        )}

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Código CIE-10</label>
              <input
                required={!isCompleted}
                type="text"
                placeholder="Ej: I10"
                className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
                value={form.diagnosisCode}
                onChange={e => setForm({ ...form, diagnosisCode: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Diagnóstico</label>
              <input
                required={!isCompleted}
                type="text"
                placeholder="Hipertensión esencial primaria"
                className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
                value={form.diagnosisDescription}
                onChange={e => setForm({ ...form, diagnosisDescription: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Examen Físico</label>
            <textarea
              rows={2}
              placeholder="Presión arterial, ritmo cardíaco..."
              className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
              value={form.physicalExamination}
              onChange={e => setForm({ ...form, physicalExamination: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
              Notas Clínicas / Evolución
            </label>
            <textarea
              required={!isCompleted}
              rows={4}
              placeholder="Escriba la evolución clínica y observaciones del paciente aquí..."
              className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
              value={form.clinicalNotes}
              onChange={e => setForm({ ...form, clinicalNotes: e.target.value })}
            />
          </div>
        </div>
      </details>

      <button
        disabled={submitting}
        type="submit"
        className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
      >
        {submitting
          ? "Guardando..."
          : isCompleted
            ? "Guardar Nota de Seguimiento"
            : "Registrar en Historia Clínica"}
      </button>
    </form>
  );
}

export default MedicalRecordForm;