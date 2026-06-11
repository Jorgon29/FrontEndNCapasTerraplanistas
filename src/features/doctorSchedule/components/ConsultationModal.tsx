import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNotesMedical, faPills, faPhoneSlash, faLock } from "@fortawesome/free-solid-svg-icons";
import type { Appointment } from "@/features/utils/Appointment";

const BASE_URL = process.env.BUN_PUBLIC_API_URL || "http://localhost:8080";

interface ConsultationModalProps {
    appointment: Appointment | null;
    onClose: () => void;
}

interface Medicine {
    id: number;
    name: string;
    category: string;
}

const MOCK_MEDICINES: Medicine[] = [
    { id: 101, name: "Amlodipino 5mg (Tableta)", category: "Cardio" },
    { id: 102, name: "Paracetamol 500mg (Tableta)", category: "Analgésico" },
    { id: 103, name: "Metformina 850mg (Tableta)", category: "Antidiabético" },
    { id: 104, name: "Amoxicilina 500mg (Cápsula)", category: "Antibiótico" },
    { id: 105, name: "Losartán 500mg (Tableta)", category: "Cardio" },
];

export default function ConsultationModal({ appointment, onClose }: ConsultationModalProps) {
    if (!appointment) return null;

    const [activeTab, setActiveTab] = useState<"record" | "prescription">("record");
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => {
        if (!searchTerm.trim()) {
            setMedicineResults([]);
            return;
        }

        if (selectedMedicine && searchTerm === selectedMedicine.name) return;

        const delaySearch = setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/medicines?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error();

                const data = await response.json();
                setMedicineResults(data);
            } catch (err) {
                const filteredMocks = MOCK_MEDICINES.filter((med) =>
                    med.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                setMedicineResults(filteredMocks);
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, selectedMedicine]);

    const [recordForm, setRecordForm] = useState({
        diagnosisCode: "",
        diagnosisDescription: "",
        clinicalNotes: "",
        physicalExamination: "",
    });

    const [prescriptionForm, setPrescriptionForm] = useState({
        medicineId: "",
        dosageInstructions: "",
        maxUsages: 3,
    });

    const handleRecordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            patient: { id: appointment.patient_id },
            appointment: { id: appointment.id },
            employee: { id: appointment.employee_id },
            ...recordForm,
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

    const handlePrescriptionSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        const payload = {
            appointment: { id: appointment.id },
            medicine: { id: Number(prescriptionForm.medicineId) },
            medicineSnapshot: { name: "Mock Medicine Name", category: "General" },
            dosageInstructions: prescriptionForm.dosageInstructions,
            maxUsages: prescriptionForm.maxUsages,
            createdBy: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            digitalSignature: `SIG-${Date.now()}-${appointment.employee_id}`,
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

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-background text-text rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-primary-light/10">

                <div className="p-4 bg-background border-b border-primary-light/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold">Consulta Virtual</h2>
                        <p className="text-xs text-text/60 soft-text">Paciente: <span className="font-semibold">{appointment.patient_name}</span></p>
                    </div>
                    <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer">
                        <FontAwesomeIcon icon={faPhoneSlash} /> Terminar llamada
                    </button>
                </div>

                <div className="flex-1 flex overflow-hidden">

                    <div className="w-1/2 p-6 bg-zinc-900 flex flex-col justify-between text-white relative">
                        <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono tracking-widest text-emerald-400 animate-pulse">
                            ● EN VIVO
                        </div>
                        <div className="flex-1 flex items-center justify-center text-2xl font-light italic text-zinc-400">
                            Videollamada con {appointment.patient_name}
                        </div>
                        <div className="bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
                            <span className="text-xs uppercase text-zinc-400 tracking-wider block mb-1">Enlace alternativo</span>
                            <a href={appointment.meeting_link} target="_blank" rel="noreferrer" className="text-primary hover:underline text-sm break-all font-mono">
                                {appointment.meeting_link}
                            </a>
                        </div>
                    </div>

                    <div className="w-1/2 bg-background border-l border-primary-light/10 flex flex-col overflow-y-auto">

                        

                        {message && (
                            <div className={`m-4 p-3 rounded-xl text-sm font-medium text-center ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
                                {message.text}
                            </div>
                        )}

                        <div className="p-6 flex-1">
                            {activeTab === "record" ? (
                                <form onSubmit={handleRecordSubmit} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Código CIE-10</label>
                                            <input required type="text" placeholder="Ej: I10" className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
                                                value={recordForm.diagnosisCode} onChange={e => setRecordForm({ ...recordForm, diagnosisCode: e.target.value })} />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Diagnóstico</label>
                                            <input required type="text" placeholder="Hipertensión esencial primaria" className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary"
                                                value={recordForm.diagnosisDescription} onChange={e => setRecordForm({ ...recordForm, diagnosisDescription: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Examen Físico</label>
                                        <textarea rows={2} placeholder="Presión arterial, ritmo cardíaco..." className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
                                            value={recordForm.physicalExamination} onChange={e => setRecordForm({ ...recordForm, physicalExamination: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Notas Clínicas / Evolución</label>
                                        <textarea required rows={4} placeholder="Escriba la evolución clínica y observaciones del paciente aquí..." className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
                                            value={recordForm.clinicalNotes} onChange={e => setRecordForm({ ...recordForm, clinicalNotes: e.target.value })} />
                                    </div>
                                    <button disabled={submitting} type="submit" className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer">
                                        {submitting ? "Guardando Registro..." : "Registrar en Historia Clínica"}
                                    </button>
                                </form>
                            ) : (
                                <form onSubmit={handlePrescriptionSubmit} className="space-y-4">
                                    <div className="grid grid-cols-3 gap-3">

                                        {/* Autocomplete Search Field */}
                                        <div className="col-span-2 relative">
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                                Medicamento
                                            </label>

                                            <input
                                                required
                                                type="text"
                                                placeholder="Escriba para buscar fármaco..."
                                                autoComplete="off"
                                                className="w-full bg-muted border border-primary-light/20 rounded-lg p-2.5 text-sm focus:outline-primary"
                                                value={searchTerm}
                                                onFocus={() => setShowDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    if (selectedMedicine && e.target.value !== selectedMedicine.name) {
                                                        setSelectedMedicine(null);
                                                    }
                                                }}
                                            />

                                            {showDropdown && medicineResults.length > 0 && (
                                                <ul className="absolute z-50 w-full left-0 mt-1 bg-background border border-primary-light/20 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-primary-light/10">
                                                    {medicineResults.map((med) => (
                                                        <li
                                                            key={med.id}
                                                            className="p-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer flex justify-between items-center"
                                                            onMouseDown={() => {
                                                                setSelectedMedicine(med);
                                                                setSearchTerm(med.name);
                                                                setShowDropdown(false);
                                                            }}
                                                        >
                                                            <span className="font-medium">{med.name}</span>
                                                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                                {med.category}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {showDropdown && searchTerm && medicineResults.length === 0 && (
                                                <div className="absolute z-50 w-full left-0 mt-1 bg-background border border-primary-light/20 rounded-xl p-3 text-xs text-text/50 italic shadow-xl">
                                                    No se encontraron coincidencias.
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-span-1">
                                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Usos Máximos</label>
                                            <input type="number" min={1} max={3} className="w-full bg-muted border border-primary-light/20 rounded-lg p-2.5 text-sm focus:outline-primary"
                                                value={prescriptionForm.maxUsages} onChange={e => setPrescriptionForm({ ...prescriptionForm, maxUsages: Number(e.target.value) })} />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Instrucciones de Dosificación</label>
                                        <textarea required rows={4} placeholder="Tomar 1 tableta cada 24 horas por las mañanas junto con alimentos..." className="w-full bg-muted border border-primary-light/20 rounded-lg p-2 text-sm focus:outline-primary resize-none"
                                            value={prescriptionForm.dosageInstructions} onChange={e => setPrescriptionForm({ ...prescriptionForm, dosageInstructions: e.target.value })} />
                                    </div>

                                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 text-[11px] soft-text text-text/60 leading-relaxed">
                                        <FontAwesomeIcon icon={faLock} /> **Firma Digital Adjunta Automática:** Al procesar esta receta, se estampará un hash criptográfico único correspondiente a su clave médica activa.
                                    </div>

                                    <button disabled={submitting} type="submit" className="w-full bg-primary text-background py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-dark transition-all disabled:opacity-50 cursor-pointer">
                                        {submitting ? "Firmando Receta..." : "Emitir Receta Médica"}
                                    </button>
                                </form>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}