import { Link } from "react-router-dom";
import { Eye, Edit } from "lucide-react";
import type { AdminEmployee } from "@/features/admin/hooks/useAdminDoctors";

interface AdminDoctorListProps {
    doctors: AdminEmployee[];
}

function AdminDoctorList({ doctors }: AdminDoctorListProps) {
    const getRoleBadgeColor = (roleCode: string) => {
        switch (roleCode) {
            case "ADMIN": return "bg-purple-100 text-purple-700";
            case "EMPLOYEE": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getRoleLabel = (roleCode: string) => {
        switch (roleCode) {
            case "ADMIN": return "Administrador";
            case "EMPLOYEE": return "Médico";
            default: return roleCode;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-success/10 text-success";
            case "revoked": return "bg-danger/10 text-danger";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    if (doctors.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-text-muted">No hay médicos registrados</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-surface-alt">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Nombre</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Rol</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Estado</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-text-muted">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {doctors.map((doctor) => (
                        <tr key={doctor.id} className="border-b border-surface-alt hover:bg-surface-alt/30">
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-bold text-primary">
                                            {doctor.firstName?.[0]}{doctor.lastName?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-text">{doctor.firstName} {doctor.lastName}</p>
                                        <p className="text-sm text-text-muted">{doctor.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(doctor.roleCode)}`}>
                                    {getRoleLabel(doctor.roleCode)}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(doctor.status)}`}>
                                    {doctor.status === "active" ? "Activo" : "Revocado"}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                    <Link
                                        to={`/admin/doctor/${doctor.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        Ver
                                    </Link>
                                    <Link
                                        to={`/admin/doctor/${doctor.id}`}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                    >
                                        <Edit className="h-3.5 w-3.5" />
                                        Editar
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDoctorList;
