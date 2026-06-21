import { useRef } from "react";
import { useConsultation } from "../providers/ConsultationProvider";
import { useMedicalRecord } from "../hooks/useMedicalRecords";

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function MedicalRecordForm() {
  const { appointment } = useConsultation();
  const { form, setForm, submitting, handleSubmit } = useMedicalRecord(appointment!);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isCompleted = appointment?.status === "COMPLETED";

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const encoded = await Promise.all(imageFiles.map(fileToBase64));

    setForm({ ...form, attachments: [...form.attachments, ...encoded] });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveAttachment = (index: number) => {
    setForm({ ...form, attachments: form.attachments.filter((_, i) => i !== index) });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {isCompleted && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs font-semibold text-amber-600 dark:text-amber-400">
          Esta consulta ya fue completada. El registro que ingreses se guardará como una nueva entrada de seguimiento en la historia clínica.
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-1">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
            Código CIE-10
          </label>
          <input
            required
            type="text"
            placeholder="Ej: I10"
            className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
            value={form.diagnosisCode}
            onChange={e => setForm({ ...form, diagnosisCode: e.target.value })}
          />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
            Diagnóstico
          </label>
          <input
            required
            type="text"
            placeholder="Hipertensión esencial primaria"
            className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
            value={form.diagnosisDescription}
            onChange={e => setForm({ ...form, diagnosisDescription: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
          Examen Físico
        </label>
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
          required
          rows={4}
          placeholder="Escriba la evolución clínica y observaciones del paciente aquí..."
          className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
          value={form.clinicalNotes}
          onChange={e => setForm({ ...form, clinicalNotes: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
          Imágenes adjuntas (opcional)
        </label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFilesSelected}
          className="block w-full text-xs text-text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer"
        />

        {form.attachments.length > 0 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {form.attachments.map((src, i) => (
              <div key={i} className="relative group">
                <img
                  src={src}
                  alt={`Adjunto ${i + 1}`}
                  className="h-16 w-full object-cover rounded-lg border border-primary-light/20"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveAttachment(i)}
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        disabled={submitting}
        type="submit"
        className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
      >
        {submitting
          ? "Guardando..."
          : isCompleted
            ? "Guardar Entrada de Seguimiento"
            : "Registrar en Historia Clínica"}
      </button>
    </form>
  );
}

export default MedicalRecordForm;