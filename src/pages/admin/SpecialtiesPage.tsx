import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faStethoscope, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useGlobalSpecialties } from "@/features/admin/hooks/useGlobalSpecialties";
import CreateSpecialtyModal from "@/features/admin/CreateSpecialtyModal";
import DeleteSpecialtyModal from "@/features/admin/DeleteSpecialtyModal";
import { Loader2 } from "lucide-react";

function SpecialtiesPage() {
    const { specialties, createSpecialty, deleteSpecialty, isLoading, isSubmitting, error } = useGlobalSpecialties();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [search, setSearch] = useState("");

    const filteredSpecialties = specialties.filter((spec) =>
        spec.name.toLowerCase().includes(search.toLowerCase()) ||
        spec.code.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-text flex items-center gap-2">
                            <FontAwesomeIcon icon={faStethoscope} className="text-primary" />
                            Gestión de Especialidades
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Administre el catálogo global de especialidades médicas.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="cursor-pointer flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Especialidad
                    </button>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background border border-surface-alt rounded-xl text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : filteredSpecialties.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <p>No hay especialidades registradas</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-alt">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Código</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Nombre</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSpecialties.map((specialty) => (
                                        <tr key={specialty.id} className="border-b border-surface-alt hover:bg-surface-alt/30">
                                            <td className="py-3 px-4">
                                                <span className="px-3 py-1 bg-surface-alt rounded-lg text-sm font-mono">
                                                    {specialty.code}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-text">{specialty.name}</p>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => setIsDeleteModalOpen(true)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <FontAwesomeIcon icon={faTrash} />
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

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
        </div>
    );
}

export default SpecialtiesPage;
