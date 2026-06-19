import type { Doctor } from "@/features/utils/Employees";
import DoctorSearchPage from "../doctor/DoctorSearchPage";
import { useState } from "react";
import ManageSpecialtiesModal from "@/features/admin/ManageSpecialtiesModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { useGlobalSpecialties } from "@/features/admin/hooks/useGlobalSpecialties";
import CreateSpecialtyModal from "@/features/admin/CreateSpecialtyModal";
import DeleteSpecialtyModal from "@/features/admin/DeleteSpecialtyModal";

function SpecialtiesPage() {
    const { specialties, createSpecialty, deleteSpecialty, isSubmitting, error } = useGlobalSpecialties();

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <div className="flex flex-col gap-6">
            
            <div className="bg-surface border border-surface-alt rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div>
                    <h1 className="text-xl font-bold text-text flex items-center gap-2">
                        <FontAwesomeIcon icon={faStethoscope} className="text-primary" />
                        Gestión de Especialidades
                    </h1>
                    <p className="text-sm text-text-muted mt-1">Administre el catálogo global o asigne especialidades a los médicos.</p>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                    <button 
                        onClick={() => setIsCreateModalOpen(true)}
                        className="cursor-pointer flex-1 sm:flex-none bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Especialidad
                    </button>
                    <button 
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="cursor-pointer flex-1 sm:flex-none bg-surface border border-red-500/30 text-red-500 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        Eliminar Especialidad
                    </button>
                </div>
            </div>

            <div className="bg-background rounded-2xl border border-surface-alt shadow-sm overflow-hidden">
                <DoctorSearchPage
                    onInteract={(doctor: Doctor) => { setSelectedDoctor(doctor); }}
                />
            </div>

            {selectedDoctor && (
                <ManageSpecialtiesModal 
                    doctor={selectedDoctor} 
                    onClose={() => setSelectedDoctor(null)} 
                />
            )}

            {isCreateModalOpen && (
                <CreateSpecialtyModal 
                    onClose={() => setIsCreateModalOpen(false)}
                    onCreate={createSpecialty}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            )}

            {isDeleteModalOpen && (
                <DeleteSpecialtyModal 
                    specialties={specialties}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDelete={deleteSpecialty}
                    isSubmitting={isSubmitting}
                    error={error}
                />
            )}
        </div>
    );
}

export default SpecialtiesPage;