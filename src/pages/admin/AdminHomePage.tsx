import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import apiClient from "@/lib/apiClient";
import { Link } from "react-router-dom";
import { Users, Calendar, Search, UserPlus, Settings, Loader2, Edit, User } from "lucide-react";

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roleCode: string;
    status: string;
    isActive: boolean;
}

function AdminHomePage() {
    const { user } = useAuth();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [specialtiesCount, setSpecialtiesCount] = useState(0);
    const [todayAppointmentsCount, setTodayAppointmentsCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const today = new Date().toISOString().split('T')[0];

                const [employeesRes, specialtiesRes, appointmentsRes] = await Promise.all([
                    apiClient.get("/admin/employees"),
                    apiClient.get("/specialty"),
                    apiClient.get(`/appointments/count?date=${today}`)
                ]);

                setEmployees(employeesRes.data || []);
                setSpecialtiesCount(specialtiesRes.data?.length || 0);
                setTodayAppointmentsCount(appointmentsRes.data?.count || 0);
            } catch (err) {
                console.error("Error fetching admin data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.status === "active").length;
    const activeDoctors = employees.filter(e => e.roleCode === "EMPLOYEE" && e.status === "active").length;
    const activeAdmins = employees.filter(e => e.roleCode === "ADMIN" && e.status === "active").length;

    const getRoleLabel = (roleCode: string) => {
        switch (roleCode) {
            case "ADMIN": return "Administrador";
            case "EMPLOYEE": return "Médico";
            default: return roleCode;
        }
    };

    const getRoleBadgeColor = (roleCode: string) => {
        switch (roleCode) {
            case "ADMIN": return "bg-purple-100 text-purple-700";
            case "EMPLOYEE": return "bg-blue-100 text-blue-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-success/10 text-success";
            case "revoked": return "bg-danger/10 text-danger";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">

                <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 p-6 md:p-8 text-white shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        ¡Bienvenido, {user?.name || "Administrador"}!
                    </h1>
                    <p className="text-white/80">
                        Panel de Administración
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-100">
                                <Users className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Total Empleados</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{totalEmployees}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Doctores Activos</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{activeDoctors}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-green-100">
                                <Settings className="h-5 w-5 text-green-600" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Especialidades</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{specialtiesCount}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-orange-100">
                                <Calendar className="h-5 w-5 text-orange-600" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Citas Hoy</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{todayAppointmentsCount}</p>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Acciones Rápidas</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/admin/search"
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            <Search className="h-4 w-4" />
                            Buscar Doctor
                        </Link>
                        <Link
                            to="/admin/employee"
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt text-text rounded-xl hover:bg-gray-200 transition-colors border border-surface-alt"
                        >
                            <UserPlus className="h-4 w-4" />
                            Crear Doctor
                        </Link>
                        <Link
                            to="/admin/specialties"
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt text-text rounded-xl hover:bg-gray-200 transition-colors border border-surface-alt"
                        >
                            <Settings className="h-4 w-4" />
                            Especialidades
                        </Link>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Lista de Empleados</h2>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    ) : employees.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No hay empleados registrados</p>
                        </div>
                    ) : (
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
                                    {employees.map((employee) => (
                                        <tr key={employee.id} className="border-b border-surface-alt hover:bg-surface-alt/30">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium text-text">{employee.firstName} {employee.lastName}</p>
                                                    <p className="text-sm text-text-muted">{employee.email}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(employee.roleCode)}`}>
                                                    {getRoleLabel(employee.roleCode)}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(employee.status)}`}>
                                                    {employee.status === "active" ? "Activo" : "Revocado"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <Link
                                                    to={`/admin/doctor/${employee.id}`}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                >
                                                    <Edit className="h-3.5 w-3.5" />
                                                    Editar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminHomePage;