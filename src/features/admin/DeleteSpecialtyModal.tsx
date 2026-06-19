import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import type { SpecialtyResponse } from "./hooks/useManageSpecialties";

interface Props {
    specialties: SpecialtyResponse[];
    onClose: () => void;
    onDelete: (id: string) => Promise<boolean>;
    isSubmitting: boolean;
    error: string | null;
}

export default function DeleteSpecialtyModal({ specialties, onClose, onDelete, isSubmitting, error }: Props) {
    const [selectedId, setSelectedId] = useState("");

    const handleDelete = async () => {
        if (!selectedId) return;
        if (!confirm("¿Está seguro de eliminar esta especialidad permanentemente?")) return;
        
        const success = await onDelete(selectedId);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-surface-alt flex flex-col">
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface">
                    <div className="flex items-center gap-3 text-red-500">
                        <FontAwesomeIcon icon={faTrash} />
                        <h2 className="text-lg font-semibold text-text">Eliminar Especialidad</h2>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
                </div>

                <div className="p-6 flex flex-col gap-4">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-3 rounded-lg flex gap-3 text-orange-600 text-sm mb-2">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
                        <p>Asegúrese de que la especialidad no esté asignada a ningún médico antes de eliminarla.</p>
                    </div>

                    {error && <div className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Seleccione la especialidad</label>
                        <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-red-500 focus:outline-none">
                            <option value="" disabled>-- Seleccionar --</option>
                            {specialties.map(s => (
                                <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text hover:bg-surface-alt transition-colors">Cancelar</button>
                        <button onClick={handleDelete} disabled={!selectedId || isSubmitting} className="bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center">
                            {isSubmitting ? "Eliminando..." : "Eliminar"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}