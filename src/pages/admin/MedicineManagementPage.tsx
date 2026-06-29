import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faPills, faSearch, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useMedicines } from "@/features/admin/hooks/useMedicines";
import { useLaboratories } from "@/features/admin/hooks/useLaboratories";
import CreateMedicineModal from "@/features/admin/CreateMedicineModal";
import DeleteMedicineModal from "@/features/admin/DeleteMedicineModal";
import EditMedicineModal from "@/features/admin/EditMedicineModal";
import { Loader2 } from "lucide-react";

function MedicineManagementPage() {
    const { medicines, createMedicine, updateMedicine, deleteMedicine, isLoading, isSubmitting, error, refetch } = useMedicines();
    const { laboratories } = useLaboratories();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
    const [search, setSearch] = useState("");

    const filteredMedicines = medicines.filter((med) =>
        med.brandName.toLowerCase().includes(search.toLowerCase()) ||
        (med.genericName && med.genericName.toLowerCase().includes(search.toLowerCase())) ||
        med.atcCode.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (med: any) => {
        setEditingMedicine(med);
        setIsEditModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-text flex items-center gap-2">
                            <FontAwesomeIcon icon={faPills} className="text-primary" />
                            Gestión de Medicamentos
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Administre el catálogo de medicamentos disponibles.</p>
                    </div>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="cursor-pointer flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Medicamento
                    </button>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <div className="relative mb-4">
                        <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, genérico o código ATC..."
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
                    ) : filteredMedicines.length === 0 ? (
                        <div className="text-center py-12 text-text-muted">
                            <p>No hay medicamentos registrados</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-surface-alt">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Nombre de Marca</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Nombre Genérico</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Código ATC</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Laboratorio</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-text-muted">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredMedicines.map((med) => (
                                        <tr key={med.id} className="border-b border-surface-alt hover:bg-surface-alt/30">
                                            <td className="py-3 px-4">
                                                <p className="font-medium text-text">{med.brandName}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-text-muted text-sm">{med.genericName || "—"}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-2 py-1 bg-surface-alt rounded text-xs font-mono">{med.atcCode}</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <p className="text-sm text-text-muted">{med.laboratoryName}</p>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    onClick={() => handleEdit(med)}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors mr-2 cursor-pointer"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setEditingMedicine(med);
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

                {isCreateModalOpen && laboratories.length > 0 && (
                    <CreateMedicineModal
                        laboratories={laboratories}
                        onClose={() => setIsCreateModalOpen(false)}
                        onCreate={createMedicine}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}

                {isDeleteModalOpen && editingMedicine && (
                    <DeleteMedicineModal
                        medicines={medicines}
                        onClose={() => {
                            setIsDeleteModalOpen(false);
                            setEditingMedicine(null);
                        }}
                        onDelete={deleteMedicine}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}

                {isEditModalOpen && editingMedicine && (
                    <EditMedicineModal
                        medicine={editingMedicine}
                        laboratories={laboratories}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setEditingMedicine(null);
                        }}
                        onUpdate={updateMedicine}
                        isSubmitting={isSubmitting}
                        error={error}
                    />
                )}
            </div>
        </div>
    );
}

export default MedicineManagementPage;