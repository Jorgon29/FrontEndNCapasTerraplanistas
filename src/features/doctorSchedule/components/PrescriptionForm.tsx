import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MedicineSearch from "./MedicineSearch";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { usePrescription } from "../hooks/usePrescription";
import { useConsultation } from "../providers/ConsultationProvider";

function PrescriptionForm() {
    const [appointment] = [useConsultation().appointment];
    const {handleSubmit, form, setForm, submitting} = usePrescription(appointment!);

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-3 gap-3">

                <MedicineSearch />

                <div className="col-span-1">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Usos Máximos</label>
                    <input type="number" min={1} max={3} className="w-full bg-muted border border-primary-light/20 rounded-lg p-2.5 text-sm focus:outline-primary"
                        value={form.maxUsages} onChange={e => setForm({ ...form, maxUsages: Number(e.target.value) })} />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Instrucciones de Dosificación</label>
                <textarea required rows={4} placeholder="Tomar 1 tableta cada 24 horas por las mañanas junto con alimentos..." className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
                    value={form.dosageInstructions} onChange={e => setForm({ ...form, dosageInstructions: e.target.value })} />
            </div>

            <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-[11px] soft-text text-text/60 leading-relaxed">
                <FontAwesomeIcon icon={faLock} /> **Firma Digital Adjunta Automática:** Al procesar esta receta, se estampará un hash criptográfico único correspondiente a su clave médica activa.
            </div>

            <button disabled={submitting} type="submit" className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer">
                {submitting ? "Firmando Receta..." : "Emitir Receta Médica"}
            </button>
        </form>
    );
}

export default PrescriptionForm;