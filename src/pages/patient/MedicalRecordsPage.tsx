import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileMedical, faSearch, faChevronDown, faChevronUp, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { usePatientMedicalRecords } from "@/features/patient/hooks/usePatientMedicalRecords";
import { Loader2 } from "lucide-react";

function MedicalRecordsPage() {
    const [filters, setFilters] = useState<{ fromDate?: string; toDate?: string; doctorId?: string }>({});
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [doctorSearch, setDoctorSearch] = useState("");

    const { records, isLoading, error, refetch } = usePatientMedicalRecords(filters);

    const uniqueDoctors = Array.from(
        records.reduce((map: Map<string, string>, r: any) => {
            if (r.doctorName && r.employeeId) {
                map.set(r.employeeId, r.doctorName);
            }
            return map;
        }, new Map<string, string>())
    ).map(([id, name]) => ({ id, name }));

    const filteredRecords = records.filter((r: any) => {
        if (doctorSearch && r.employeeId !== doctorSearch) return false;
        return true;
    });

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-text flex items-center gap-2 mb-1">
                        <FontAwesomeIcon icon={faFileMedical} className="text-primary" />
                        Mis Registros Clínicos
                    </h1>
                    <p className="text-sm text-text-muted">Historial de consultas y diagnósticos.</p>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-4 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-text-muted">
                        <FontAwesomeIcon icon={faSearch} />
                        Filtros
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Doctor</label>
                            <select
                                value={filters.doctorId || ""}
                                onChange={e => setFilters({ ...filters, doctorId: e.target.value || undefined })}
                                className="w-full bg-background border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none"
                            >
                                <option value="">Todos</option>
                                {uniqueDoctors.map(d => (
                                    <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                            </select>
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
                    ) : filteredRecords.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <FontAwesomeIcon icon={faStethoscope} className="text-4xl mb-3 opacity-30" />
                            <p>No hay registros clínicos</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRecords.map((record) => (
                                <div key={record.id} className="border border-surface-alt rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-surface-alt/30 transition-colors text-left cursor-pointer"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-mono rounded">
                                                    {record.diagnosisCode}
                                                </span>
                                                <span className="text-xs text-text-muted">
                                                    {new Date(record.createdAt).toLocaleDateString("es-SV", {
                                                        year: "numeric", month: "long", day: "numeric"
                                                    })}
                                                </span>
                                            </div>
                                            <p className="font-medium text-text">{record.diagnosisDescription}</p>
                                            <p className="text-sm text-text-muted">{record.doctorName}</p>
                                        </div>
                                        <FontAwesomeIcon
                                            icon={expandedId === record.id ? faChevronUp : faChevronDown}
                                            className="text-text-muted"
                                        />
                                    </button>

                                    {expandedId === record.id && (
                                        <div className="px-4 pb-4 border-t border-surface-alt pt-3 space-y-3">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Examen Físico</p>
                                                <p className="text-sm text-text">{record.physicalExamination || "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">Notas Clínicas</p>
                                                <p className="text-sm text-text">{record.clinicalNotes}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MedicalRecordsPage;