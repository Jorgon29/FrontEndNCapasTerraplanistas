import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MedicineSearch, { type Medicine } from "./MedicineSearch";
import { useConsultation } from "../providers/ConsultationProvider";
import { usePrescription } from "../hooks/usePrescription";

function PrescriptionForm() {
  const { appointment } = useConsultation();
  const { handleSubmit, form, setForm, submitting, addMedicineRow, removeMedicineRow, updateMedicineRow } = usePrescription(appointment!);

  const handleMedicineSelect = (index: number, medicine: Medicine) => {
    updateMedicineRow(index, { medicineId: String(medicine.id), medicineName: medicine.name });
    if (index === form.medicines.length - 1) addMedicineRow();
  };

  if (appointment?.status === "COMPLETED") return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-text/70">
          Medicamentos
        </label>

        {form.medicines.map((row, index) => (
          <div key={index} className="grid grid-cols-3 gap-3 items-start">
            <div className="col-span-2">
              <MedicineSearch
                onSelect={(medicine) => handleMedicineSelect(index, medicine)}
                initialValue={row.medicineName}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number" min={1} max={3}
                  className="w-full bg-muted border border-primary-light/20 rounded-lg p-2.5 text-sm focus:outline-primary"
                  value={row.maxUsages}
                  onChange={e => updateMedicineRow(index, { maxUsages: Number(e.target.value) })}
                />
              </div>
              {form.medicines.length > 1 && index < form.medicines.length - 1 && (
                <button
                  type="button"
                  onClick={() => removeMedicineRow(index)}
                  className="px-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
          Instrucciones de Dosificación
        </label>
        <textarea
          required rows={4}
          placeholder="Tomar 1 tableta cada 24 horas por las mañanas junto con alimentos..."
          className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
          value={form.instructions}
          onChange={e => setForm({ ...form, instructions: e.target.value })}
        />
      </div>

      <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-[11px] text-text/60 leading-relaxed">
        <FontAwesomeIcon icon={faLock} /> Firma Digital Adjunta Automática: Al procesar esta receta, se estampará un hash criptográfico único correspondiente a su clave médica activa.
      </div>

      <button
        disabled={submitting} type="submit"
        className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer"
      >
        {submitting ? "Firmando Receta..." : "Emitir Receta Médica"}
      </button>
    </form>
  );
}

export default PrescriptionForm;