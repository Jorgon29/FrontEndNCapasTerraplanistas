import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface SpecialtyResponse {
    id: string;
    code: string;
    name: string;
}

interface Props {
    doctorId: string;
    existingSpecialtyIds: string[];
    onClose: () => void;
    onAdd: (specialtyId: string, licenseNumber: string) => Promise<boolean>;
}

export default function AddSpecialtyModal({ doctorId, existingSpecialtyIds, onClose, onAdd }: Props) {
    const [specialties, setSpecialties] = useState<SpecialtyResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSpecialties = async () => {
            try {
                const res = await apiClient.get("/specialty");
                const allSpecialties = res.data || [];
                const available = allSpecialties.filter(
                    (s: SpecialtyResponse) => !existingSpecialtyIds.includes(s.id)
                );
                setSpecialties(available);
                if (available.length > 0) {
                    setSelectedSpecialtyId(available[0].id);
                }
            } catch (err) {
                console.error(err);
                setError("No se pudo cargar las especialidades.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchSpecialties();
    }, [existingSpecialtyIds]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSpecialtyId || !licenseNumber.trim()) {
            setError("Todos los campos son requeridos.");
            return;
        }

        setIsSubmitting(true);
        setError(null);
        const success = await onAdd(selectedSpecialtyId, licenseNumber.trim());
        setIsSubmitting(false);

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-surface-alt flex flex-col">
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface">
                    <div className="flex items-center gap-3 text-primary">
                        <FontAwesomeIcon icon={faStethoscope} />
                        <h2 className="text-lg font-semibold text-text">Agregar Especialidad</h2>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && <div className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm">{error}</div>}

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 text-primary animate-spin" />
                        </div>
                    ) : specialties.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            <p>No hay especialidades disponibles para agregar.</p>
                        </div>
                    ) : (
                        <>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Especialidad</label>
                                <select
                                    value={selectedSpecialtyId}
                                    onChange={e => setSelectedSpecialtyId(e.target.value)}
                                    className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                                >
                                    {specialties.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.name} ({s.code})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Número de Licencia Profesional</label>
                                <input
                                    type="text"
                                    required
                                    value={licenseNumber}
                                    onChange={e => setLicenseNumber(e.target.value)}
                                    placeholder="Ej. MP-12345"
                                    className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                        </>
                    )}

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text hover:bg-surface-alt transition-colors">
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || specialties.length === 0}
                            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            )}
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
