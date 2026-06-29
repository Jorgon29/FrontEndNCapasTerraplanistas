import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPills, faSearch, faCopy, faCheck, faPrescription } from "@fortawesome/free-solid-svg-icons";
import { usePatientPrescriptions } from "@/features/patient/hooks/usePatientPrescriptions";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { Loader2 } from "lucide-react";

function PrescriptionsPage() {
    const { user } = useAuth();
    const patientId = user?.id || "";

    const [filters, setFilters] = useState<{ fromDate?: string; toDate?: string }>({});
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [dispensingId, setDispensingId] = useState<string | null>(null);

    const { prescriptions, isLoading, error, refetch, dispensePrescription } = usePatientPrescriptions(patientId, filters);

    const handleCopySignature = (id: string, signature: string) => {
        navigator.clipboard.writeText(signature);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDispense = async (prescriptionId: string) => {
        if (!confirm("¿Dispensar esta receta? Se incrementará el contador de usos.")) return;
        setDispensingId(prescriptionId);
        try {
            await dispensePrescription(prescriptionId);
        } catch (err) {
            alert("Error al dispensar la receta");
        } finally {
            setDispensingId(null);
        }
    };

    const filteredPrescriptions = prescriptions;

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-text flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faPills} className="text-primary" />
                        Mis Recetas Médicas
                    </h1>
                    <p className="text-sm text-text-muted">Recetas emitidas por sus doctores. Use cada receta hasta 3 veces.</p>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                        <FontAwesomeIcon icon={faSearch} />
                        Filtros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Desde</label>
                            <input
                                type="date"
                                value={filters.fromDate || ""}
                                onChange={e => setFilters({ ...filters, fromDate: e.target.value || undefined })}
                                className="w-full bg-background border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Hasta</label>
                            <input
                                type="date"
                                value={filters.toDate || ""}
                                onChange={e => setFilters({ ...filters, toDate: e.target.value || undefined })}
                                className="w-full bg-background border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : filteredPrescriptions.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <FontAwesomeIcon icon={faPrescription} className="text-4xl mb-3 opacity-30" />
                            <p>No hay recetas médicas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredPrescriptions.map((rx) => {
                                const remaining = rx.maxUsages - rx.usageCount;
                                const isExhausted = remaining <= 0;

                                return (
                                    <div key={rx.id} className="border border-surface-alt rounded-xl p-4 space-y-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                                                        {rx.medicineSnapshot?.brandName || "Medicamento"}
                                                    </span>
                                                    <span className={`text-xs font-bold ${isExhausted ? "text-red-500" : "text-accent"}`}>
                                                        {remaining}/{rx.maxUsages} usos
                                                    </span>
                                                </div>
                                                <p className="text-sm text-text-muted mb-2">{rx.dosageInstructions}</p>
                                                <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                                    <span>Fecha:</span>
                                                    <span>{new Date(rx.createdAt).toLocaleDateString("es-SV", {
                                                        year: "numeric", month: "long", day: "numeric"
                                                    })}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-surface-alt/30 rounded-lg p-2.5">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Firma Digital</span>
                                                <button
                                                    onClick={() => handleCopySignature(rx.id, rx.digitalSignature)}
                                                    className="text-[10px] text-primary hover:text-primary-dark flex items-center gap-1 cursor-pointer"
                                                >
                                                    {copiedId === rx.id ? (
                                                        <><FontAwesomeIcon icon={faCheck} className="w-3 h-3" /> Copiado</>
                                                    ) : (
                                                        <><FontAwesomeIcon icon={faCopy} className="w-3 h-3" /> Copiar</>
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-xs font-mono text-text break-all">{rx.digitalSignature}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDispense(rx.id)}
                                            disabled={isExhausted || dispensingId === rx.id}
                                            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                                                isExhausted
                                                    ? "bg-surface-alt text-text-muted cursor-not-allowed"
                                                    : "bg-primary text-white hover:bg-primary-dark"
                                            }`}
                                        >
                                            {dispensingId === rx.id ? "Dispensando..." : isExhausted ? "Sin usos disponibles" : "Usar receta"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PrescriptionsPage;