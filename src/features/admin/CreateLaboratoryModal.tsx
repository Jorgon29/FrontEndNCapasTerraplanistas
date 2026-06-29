import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlask, faPlus } from "@fortawesome/free-solid-svg-icons";

interface Props {
    onClose: () => void;
    onCreate: (name: string) => Promise<boolean>;
    isSubmitting: boolean;
    error: string | null;
}

export default function CreateLaboratoryModal({ onClose, onCreate, isSubmitting, error }: Props) {
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await onCreate(name);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-surface-alt flex flex-col">
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface">
                    <div className="flex items-center gap-3 text-primary">
                        <FontAwesomeIcon icon={faFlask} />
                        <h2 className="text-lg font-semibold text-text">Nuevo Laboratorio</h2>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && <div className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Nombre del Laboratorio</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Ej. Pfizer, Roche, Bayer"
                            className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text hover:bg-surface-alt transition-colors cursor-pointer">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center cursor-pointer">
                            {isSubmitting ? "Guardando..." : <><FontAwesomeIcon icon={faPlus} className="mr-2"/> Guardar</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}