import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faFlask, faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useLaboratories } from "@/features/admin/hooks/useLaboratories";
import CreateLaboratoryModal from "@/features/admin/CreateLaboratoryModal";
import DeleteLaboratoryModal from "@/features/admin/DeleteLaboratoryModal";
import EditLaboratoryModal from "@/features/admin/EditLaboratoryModal";
import { Loader2 } from "lucide-react";

function LaboratoryManagementPage() {
    const { laboratories, createLaboratory, updateLaboratory, deleteLaboratory, isLoading, isSubmitting, error, refetch } = useLaboratories();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingLaboratory, setEditingLaboratory] = useState<{ id: string; name: string } | null>(null);
    const [search, setSearch] = useState("");

    const filteredLaboratories = laboratories.filter((lab) =>
        lab.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (lab: { id: string; name: string }) => {
        setEditingLaboratory(lab);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-text flex items-center gap-2">
                            <FontAwesomeIcon icon={faFlask} className="text-primary" />
                            Gestión de Laboratorios
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Administre el catálogo de laboratorios farmacéuticos.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="cursor-pointer flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Laboratorio
                    </button>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
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
                    ) : filteredLaboratories.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <p>No hay laboratorios registrados</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-alt">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Nombre</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLaboratories.map((lab) => (
                                        <tr key={lab.id} className="border-b border-surface-alt hover:bg-surface-alt/30">
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-text">{lab.name}</p>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(lab)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors mr-2 cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingLaboratory(lab);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
                    <CreateLaboratoryModal
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreate={createLaboratory}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}

                {isDeleteModalOpen && editingLaboratory && (
                    <DeleteLaboratoryModal
                        laboratories={laboratories}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setEditingLaboratory(null);
                        }}
                        onDelete={deleteLaboratory}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}

                {isEditModalOpen && editingLaboratory && (
                    <EditLaboratoryModal
                        laboratory={editingLaboratory}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingLaboratory(null);
                        }}
                        onUpdate={updateLaboratory}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
}

export default LaboratoryManagementPage;