import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPills, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { LaboratoryResponse } from "./hooks/useLaboratories";
import type { MedicineRequest } from "./hooks/useMedicines";

interface Props {
    laboratories: LaboratoryResponse[];
    onClose: () => void;
    onCreate: (request: MedicineRequest) => Promise<boolean>;
    isSubmitting: boolean;
    error: string | null;
}

export default function CreateMedicineModal({ laboratories, onClose, onCreate, isSubmitting, error }: Props) {
    const [laboratoryId, setLaboratoryId] = useState(laboratories[0]?.id || "");
    const [brandName, setBrandName] = useState("");
    const [genericName, setGenericName] = useState("");
    const [atcCode, setAtcCode] = useState("");
    const [useFrom, setUseFrom] = useState("");
    const [compositionKey, setCompositionKey] = useState("");
    const [compositionValue, setCompositionValue] = useState("");
    const [compositionList, setCompositionList] = useState<{ key: string; value: string }[]>([]);

    const handleAddComposition = () => {
        if (compositionKey.trim() && compositionValue.trim()) {
            setCompositionList([...compositionList, { key: compositionKey.trim(), value: compositionValue.trim() }]);
            setCompositionKey("");
            setCompositionValue("");
        }
    };

    const handleRemoveComposition = (index: number) => {
        setCompositionList(compositionList.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const composition: Record<string, object> = {};
        compositionList.forEach(item => { composition[item.key] = item.value; });

        const request: MedicineRequest = {
            laboratoryId,
            brandName,
            genericName,
            atcCode,
            useFrom,
            composition
        };
        const success = await onCreate(request);
        if (success) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-surface-alt flex flex-col">
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface sticky top-0">
                    <div className="flex items-center gap-3 text-primary">
                        <FontAwesomeIcon icon={faPills} />
                        <h2 className="text-lg font-semibold text-text">Nuevo Medicamento</h2>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl cursor-pointer">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && <div className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm">{error}</div>}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Laboratorio</label>
                        <select
                            required
                            value={laboratoryId}
                            onChange={e => setLaboratoryId(e.target.value)}
                            className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                        >
                            <option value="" disabled>-- Seleccionar Laboratorio --</option>
                            {laboratories.map(l => (
                                <option key={l.id} value={l.id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Nombre de Marca *</label>
                        <input
                            type="text"
                            required
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
                            placeholder="Ej. Amlodipino 5mg"
                            className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Nombre Genérico</label>
                        <input
                            type="text"
                            value={genericName}
                            onChange={e => setGenericName(e.target.value)}
                            placeholder="Ej. Besilato de Amlodipino"
                            className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Código ATC *</label>
                            <input
                                type="text"
                                required
                                value={atcCode}
                                onChange={e => setAtcCode(e.target.value)}
                                placeholder="Ej. C08CA01"
                                className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Uso *</label>
                            <input
                                type="text"
                                required
                                value={useFrom}
                                onChange={e => setUseFrom(e.target.value)}
                                placeholder="Ej. Oral"
                                className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Composición</label>
                        <div className="flex gap-2 mb-2">
                            <input
                                type="text"
                                value={compositionKey}
                                onChange={e => setCompositionKey(e.target.value)}
                                placeholder="Clave (ej. principio_activo)"
                                className="flex-1 bg-surface border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none"
                            />
                            <input
                                type="text"
                                value={compositionValue}
                                onChange={e => setCompositionValue(e.target.value)}
                                placeholder="Valor"
                                className="flex-1 bg-surface border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleAddComposition}
                                className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                            </button>
                        </div>
                        {compositionList.length > 0 && (
                            <div className="bg-surface-alt/30 rounded-lg p-2 space-y-1">
                                {compositionList.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm">
                                        <span className="text-text-muted">{item.key}:</span>
                                        <span className="text-text font-medium">{item.value}</span>
                                        <button type="button" onClick={() => handleRemoveComposition(idx)} className="text-red-500 hover:text-red-600 text-xs cursor-pointer">✕</button>
                                    </div>
                                ))}
                            </div>
                        )}
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