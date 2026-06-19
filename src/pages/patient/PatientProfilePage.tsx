import React, { useState } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSave, faTrash, faExclamationTriangle, faCheckCircle, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { usePatientProfile } from "@/features/patient/hooks/usePatientProfile";

export default function PatientProfilePage() {
    const { patient } = useAuth();

    if (!patient) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center text-text-muted">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2 text-xl" /> Cargando perfil...
            </div>
        );
    }

    const {
        formData,
        isSubmitting,
        isDeleting,
        error,
        success,
        handleChange,
        handleUpdate,
        handleDeleteAccount
    } = usePatientProfile(patient);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <div className="min-h-screen bg-background p-6 md:p-12 flex justify-center items-start">
            <div className="w-full max-w-3xl flex flex-col gap-6">
                
                {/* Profile Header */}
                <div className="bg-surface border border-surface-alt rounded-2xl shadow-sm p-6 flex items-center gap-4">
                    <div className="bg-primary/10 text-primary w-16 h-16 rounded-full flex items-center justify-center text-2xl">
                        <FontAwesomeIcon icon={faUser} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-text">Mi Perfil</h1>
                        <p className="text-sm text-text-muted mt-1">
                            Administra tu información personal y configuración de cuenta.
                        </p>
                    </div>
                </div>

                {/* Edit Form Card */}
                <div className="bg-surface border border-surface-alt rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-surface-alt bg-background/50">
                        <h2 className="text-lg font-semibold text-text">Información Personal</h2>
                    </div>

                    {error && (
                        <div className="mx-6 mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-600">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mx-6 mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3 text-green-600">
                            <FontAwesomeIcon icon={faCheckCircle} className="mt-0.5" />
                            <p className="text-sm font-medium">{success}</p>
                        </div>
                    )}

                    <form onSubmit={handleUpdate} className="p-6 flex flex-col gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">Nombres</label>
                                <input type="text" name="first_name" required value={formData.first_name} onChange={handleChange} className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">Apellidos</label>
                                <input type="text" name="last_name" required value={formData.last_name} onChange={handleChange} className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">Teléfono</label>
                                <input type="tel" name="phones" required value={formData.phones} onChange={handleChange} className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">Dirección</label>
                                <input type="text" name="address" required value={formData.address} onChange={handleChange} className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm text-text focus:outline-none focus:border-primary transition-colors" />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button type="submit" disabled={isSubmitting} className="bg-primary text-white rounded-xl px-8 py-3 text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center">
                                {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Guardando...</> : <><FontAwesomeIcon icon={faSave} className="mr-2" /> Guardar Cambios</>}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl shadow-sm overflow-hidden mt-4">
                    <div className="px-6 py-4 border-b border-red-500/20 bg-red-500/10">
                        <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
                            <FontAwesomeIcon icon={faExclamationTriangle} /> Zona de Peligro
                        </h2>
                    </div>
                    
                    <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-md font-bold text-text">Eliminar cuenta</h3>
                            <p className="text-sm text-text-muted mt-1 max-w-lg">
                                Al eliminar tu cuenta, perderás acceso a la plataforma. Esta acción no se puede deshacer de forma manual desde esta interfaz.
                            </p>
                        </div>

                        {showDeleteConfirm ? (
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-text hover:bg-surface-alt transition-colors">
                                    Cancelar
                                </button>
                                <button onClick={handleDeleteAccount} disabled={isDeleting} className="bg-red-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex items-center disabled:opacity-50">
                                    {isDeleting ? "Eliminando..." : "Sí, eliminar cuenta"}
                                </button>
                            </div>
                        ) : (
                            <button onClick={() => setShowDeleteConfirm(true)} className="bg-background border border-red-500/30 text-red-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500 hover:text-white transition-colors flex items-center whitespace-nowrap w-full sm:w-auto justify-center">
                                <FontAwesomeIcon icon={faTrash} className="mr-2" /> Eliminar Cuenta
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

