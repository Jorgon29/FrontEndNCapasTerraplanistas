import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAdminDoctorDetail } from "@/features/admin/hooks/useAdminDoctorDetail";
import AddSpecialtyModal from "@/features/admin/AddSpecialtyModal";
import AddAvailabilityModal from "@/features/admin/AddAvailabilityModal";
import { Loader2, ArrowLeft, Save, Trash2, UserX, UserCheck, Plus, Edit } from "lucide-react";

function DoctorDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { doctor, isLoading, error, updateDoctor, addSpecialty, updateSpecialty, removeSpecialty, addAvailability, revokeAccess, reactivate } = useAdminDoctorDetail(id || "");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phones, setPhones] = useState("");
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddSpecialtyOpen, setIsAddSpecialtyOpen] = useState(false);
    const [isAddAvailabilityOpen, setIsAddAvailabilityOpen] = useState(false);
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState("");
    const [selectedSpecialtyName, setSelectedSpecialtyName] = useState("");
    const [editingSpecialtyId, setEditingSpecialtyId] = useState<string | null>(null);
    const [editLicense, setEditLicense] = useState("");
    const [editFee, setEditFee] = useState("");
    const [editDuration, setEditDuration] = useState("");
    const [isSavingSpecialty, setIsSavingSpecialty] = useState(false);

    useEffect(() => {
        if (doctor) {
            setFirstName(doctor.firstName);
            setLastName(doctor.lastName);
            setPhones(doctor.phones || "");
            setAddress(doctor.address || "");
        }
    }, [doctor]);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await updateDoctor({ firstName, lastName, phones, address });
        setIsSaving(false);
        if (success) {
            setIsEditing(false);
        }
    };

    const handleRevoke = async () => {
        if (!confirm("¿Está seguro de revocar el acceso a este doctor?")) return;
        await revokeAccess();
    };

    const handleReactivate = async () => {
        await reactivate();
    };

    const handleRemoveSpecialty = async (specialtyId: string) => {
        if (!confirm("¿Está seguro de eliminar esta especialidad?")) return;
        await removeSpecialty(specialtyId);
    };

    const handleAddSpecialty = async (specialtyId: string, licenseNumber: string) => {
        return await addSpecialty(specialtyId, licenseNumber);
    };

    const handleStartEditSpecialty = (specialty: { specialtyId: string; professionalLicenseNumber: string; feePerHour: number; consultDurationMinutes: number }) => {
        setEditingSpecialtyId(specialty.specialtyId);
        setEditLicense(specialty.professionalLicenseNumber);
        setEditFee(specialty.feePerHour.toString());
        setEditDuration(specialty.consultDurationMinutes.toString());
    };

    const handleSaveSpecialty = async () => {
        setIsSavingSpecialty(true);
        const success = await updateSpecialty(
            editingSpecialtyId!,
            editLicense,
            parseFloat(editFee),
            parseInt(editDuration)
        );
        setIsSavingSpecialty(false);
        if (success) {
            setEditingSpecialtyId(null);
        }
    };

    const handleCancelEditSpecialty = () => {
        setEditingSpecialtyId(null);
        setEditLicense("");
        setEditFee("");
        setEditDuration("");
    };

    const handleOpenAddAvailability = (specialtyId: string, specialtyName: string) => {
        setSelectedSpecialtyId(specialtyId);
        setSelectedSpecialtyName(specialtyName);
        setIsAddAvailabilityOpen(true);
    };

    const handleAddAvailability = async (dayOfWeek: string, startTime: string, endTime: string) => {
        return await addAvailability(doctor!.id, selectedSpecialtyId, dayOfWeek, startTime, endTime);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error || "Doctor no encontrado"}</p>
                    <button onClick={() => navigate("/admin")} className="text-primary hover:underline">
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    const isActive = doctor.status === "active";
    const isDoctor = doctor.roleCode === "EMPLOYEE";
    const existingSpecialtyIds = doctor.specialties.map(s => s.specialtyId);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl space-y-6">

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => navigate("/admin")}
                        className="flex items-center gap-2 text-text-muted hover:text-text transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Volver
                    </button>
                    <div className="flex gap-3">
                        {isActive ? (
                            <button
                                onClick={handleRevoke}
                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                            >
                                <UserX className="h-4 w-4" />
                                Revocar Acceso
                            </button>
                        ) : (
                            <button
                                onClick={handleReactivate}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors"
                            >
                                <UserCheck className="h-4 w-4" />
                                Reactivar
                            </button>
                        )}
                        {isEditing ? (
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
                            >
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                Guardar
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-surface border border-surface-alt text-text rounded-xl hover:bg-surface-alt transition-colors"
                            >
                                Editar
                            </button>
                        )}
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-2xl font-bold text-primary">
                                {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                            </span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-text">
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="bg-background border border-surface-alt rounded-lg px-2 py-1 text-2xl font-bold"
                                    />
                                ) : (
                                    `Dr. ${doctor.firstName} ${doctor.lastName}`
                                )}
                            </h1>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="bg-background border border-surface-alt rounded-lg px-2 py-1 mt-1"
                                />
                            ) : (
                                <p className="text-text-muted">{doctor.email}</p>
                            )}
                            <div className="flex gap-2 mt-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDoctor ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>
                                    {isDoctor ? "Médico" : "Administrador"}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {isActive ? "Activo" : "Inactivo"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                                Teléfono
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={phones}
                                    onChange={(e) => setPhones(e.target.value)}
                                    className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                />
                            ) : (
                                <p className="text-text">{phones || "No registrado"}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                                Dirección
                            </label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full bg-background border border-surface-alt rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                                />
                            ) : (
                                <p className="text-text">{address || "No registrada"}</p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text">Especialidades</h2>
                        <button
                            onClick={() => setIsAddSpecialtyOpen(true)}
                            className="flex items-center gap-2 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary-dark transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar
                        </button>
                    </div>

                    {doctor.specialties.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            <p>No hay especialidades registradas</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {doctor.specialties.map((specialty) => (
                                <div key={specialty.specialtyId} className="border border-surface-alt rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-text">{specialty.name}</h3>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleStartEditSpecialty(specialty)}
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleRemoveSpecialty(specialty.specialtyId)}
                                                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {editingSpecialtyId === specialty.specialtyId ? (
                                        <div className="bg-surface-alt/50 rounded-lg p-4 space-y-3">
                                            <div>
                                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                                    Licencia Profesional
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editLicense}
                                                    onChange={(e) => setEditLicense(e.target.value)}
                                                    className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none"
                                                />
                                            </div>
                                            <div className="flex gap-4 items-end">
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                                        Precio/Hora ($)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editFee}
                                                        onChange={(e) => setEditFee(e.target.value)}
                                                        className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none"
                                                        min="1"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                                        Duración (min)
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={editDuration}
                                                        onChange={(e) => setEditDuration(e.target.value)}
                                                        className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm focus:border-primary focus:outline-none"
                                                        min="15"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2">
                                                <button
                                                    onClick={handleCancelEditSpecialty}
                                                    className="px-3 py-1.5 text-sm text-text-muted hover:text-text transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    onClick={handleSaveSpecialty}
                                                    disabled={isSavingSpecialty}
                                                    className="px-3 py-1.5 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-1"
                                                >
                                                    {isSavingSpecialty && <Loader2 className="h-3 w-3 animate-spin" />}
                                                    Guardar
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-text-muted">
                                            Licencia: {specialty.professionalLicenseNumber} | ${specialty.feePerHour}/hr | {specialty.consultDurationMinutes} min
                                        </p>
                                    )}

                                    <div className="border-t border-surface-alt pt-3 mt-3">
                                        <p className="text-xs font-bold uppercase tracking-wider text-text/70 mb-2">Horarios</p>
                                        {specialty.availabilities.length === 0 ? (
                                            <p className="text-sm text-text-muted">Sin horarios registrados</p>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {specialty.availabilities.map((slot) => (
                                                    <span key={slot.id} className="px-3 py-1 bg-surface-alt rounded-lg text-sm">
                                                        {slot.dayOfWeek} {slot.startTime?.substring(0, 5)} - {slot.endTime?.substring(0, 5)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleOpenAddAvailability(specialty.specialtyId, specialty.name)}
                                            className="mt-2 text-sm text-primary hover:underline"
                                        >
                                            + Agregar horario
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Estado de Cuenta</h2>
                    <div className="flex gap-3">
                        <label className={`flex items-center gap-2 flex-1 cursor-pointer rounded-xl border p-4 transition-colors ${isActive ? "border-success bg-success/10" : "border-surface-alt"}`}>
                            <input
                                type="radio"
                                name="status"
                                checked={isActive}
                                onChange={() => {}}
                                className="accent-success"
                            />
                            <span className={isActive ? "text-success" : "text-text-muted"}>Activo</span>
                        </label>
                        <label className={`flex items-center gap-2 flex-1 cursor-pointer rounded-xl border p-4 transition-colors ${!isActive ? "border-danger bg-danger/10" : "border-surface-alt"}`}>
                            <input
                                type="radio"
                                name="status"
                                checked={!isActive}
                                onChange={() => {}}
                                className="accent-danger"
                            />
                            <span className={!isActive ? "text-danger" : "text-text-muted"}>Inactivo</span>
                        </label>
                    </div>
                </div>
            </div>

            {isAddSpecialtyOpen && (
                <AddSpecialtyModal
                    doctorId={doctor.id}
                    existingSpecialtyIds={existingSpecialtyIds}
                    onClose={() => setIsAddSpecialtyOpen(false)}
                    onAdd={handleAddSpecialty}
                />
            )}

            {isAddAvailabilityOpen && (
                <AddAvailabilityModal
                    employeeId={doctor.id}
                    specialtyId={selectedSpecialtyId}
                    specialtyName={selectedSpecialtyName}
                    onClose={() => setIsAddAvailabilityOpen(false)}
                    onAdd={handleAddAvailability}
                />
            )}
        </div>
    );
}

export default DoctorDetailPage;
