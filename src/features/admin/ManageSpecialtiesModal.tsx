import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faStethoscope, faSpinner } from "@fortawesome/free-solid-svg-icons";
import type { Doctor, Speciality } from "@/features/utils/Employees";
import { useManageSpecialties, type SpecialtyResponse } from "./hooks/useManageSpecialties";

interface ManageSpecialtiesModalProps {
    doctor: Doctor;
    onClose: () => void;
}

export default function ManageSpecialtiesModal({ doctor, onClose }: ManageSpecialtiesModalProps) {
    const {
        availableSpecialties,
        isLoadingCatalog,
        localDoctorSpecialties,
        formState,
        isSubmitting,
        error,
        handleAdd,
        handleRemove
    } = useManageSpecialties(doctor);

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-surface-alt flex flex-col max-h-[90vh]">
                
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary p-2 rounded-lg">
                            <FontAwesomeIcon icon={faStethoscope} />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-text">Especialidades</h2>
                            <p className="text-xs text-text-muted">Dr. {doctor.first_name} {doctor.last_name}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
                </div>

                <div className="overflow-y-auto p-6 flex flex-col gap-8">
                    
                    <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-text/70">Especialidades Actuales</h3>
                        <div className="border border-surface-alt rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm text-text">
                                <thead className="bg-surface border-b border-surface-alt text-xs uppercase text-text-muted">
                                    <tr>
                                        <th className="px-4 py-3">Especialidad</th>
                                        <th className="px-4 py-3">Licencia</th>
                                        <th className="px-4 py-3">Tarifa/Hr</th>
                                        <th className="px-4 py-3 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-alt bg-background">
                                    {localDoctorSpecialties.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-6 text-center text-text-muted italic">
                                                Este médico no tiene especialidades asignadas.
                                            </td>
                                        </tr>
                                    ) : (
                                        localDoctorSpecialties.map((spec: Speciality) => (
                                            <tr key={spec.id} className="hover:bg-surface/50 transition-colors">
                                                <td className="px-4 py-3 font-medium">{spec.name}</td>
                                                <td className="px-4 py-3">{spec.licence}</td>
                                                <td className="px-4 py-3">${spec.feePerHour}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <button
                                                        onClick={() => handleRemove(spec.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                                                        title="Remover especialidad"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="bg-surface border border-surface-alt rounded-xl p-5">
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-text/70">Asignar Nueva Especialidad</h3>
                        
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Especialidad</label>
                                {isLoadingCatalog ? (
                                    <div className="p-2 text-sm text-text-muted"><FontAwesomeIcon icon={faSpinner} spin className="mr-2"/> Cargando...</div>
                                ) : (
                                    <select required value={formState.selectedSpecialtyId} onChange={e => formState.setSelectedSpecialtyId(e.target.value)} className="w-full bg-background border border-surface-alt rounded-lg p-2.5 text-sm focus:border-primary focus:outline-none">
                                        <option value="" disabled>Seleccione una especialidad</option>
                                        {availableSpecialties.map( (s : SpecialtyResponse) => (
                                            <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Licencia (Matrícula)</label>
                                <input type="text" required value={formState.licenseNumber} onChange={e => formState.setLicenseNumber(e.target.value)} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Tarifa por Hora ($)</label>
                                <input type="number" step="0.01" min="0.01" required value={formState.feePerHour} onChange={e => formState.setFeePerHour(Number(e.target.value))} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Duración Consulta (Minutos)</label>
                                <input type="number" min="5" required value={formState.consultDuration} onChange={e => formState.setConsultDuration(Number(e.target.value))} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Turno (JSON Map)</label>
                                <textarea required rows={3} value={formState.shiftJSON} onChange={e => formState.setShiftJSON(e.target.value)} className="w-full bg-background border border-surface-alt rounded-lg p-2 focus:border-primary focus:outline-none font-mono text-xs" />
                            </div>

                            <div className="md:col-span-2 flex justify-end mt-2">
                                <button type="submit" disabled={isSubmitting || isLoadingCatalog} className="bg-primary text-white rounded-lg px-6 py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center">
                                    {isSubmitting ? "Asignando..." : <><FontAwesomeIcon icon={faPlus} className="mr-2"/> Asignar Especialidad</>}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}