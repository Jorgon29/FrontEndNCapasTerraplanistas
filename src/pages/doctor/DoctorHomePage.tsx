import { useAuth } from "@/features/auth/providers/AuthProvider";
import apiClient from "@/lib/apiClient";
import { Appointment } from "@/features/utils/Appointment";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, CalendarDays, User, Loader2, Monitor, FileMedical, Pill } from "lucide-react";

interface DoctorStats {
    todayCount: number;
    weekCount: number;
    pendingConsultations: number;
    completedThisMonth: number;
}

function DoctorHomePage() {
    const { user, doctor } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [stats, setStats] = useState<DoctorStats>({
        todayCount: 0,
        weekCount: 0,
        pendingConsultations: 0,
        completedThisMonth: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const doctorId = doctor?.id || user?.id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                const today = new Date();
                const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                const todayStr = today.toISOString().split('T')[0];
                const weekEnd = new Date(today);
                weekEnd.setDate(weekEnd.getDate() + 7);
                const weekEndStr = weekEnd.toISOString().split('T')[0];

                const response = await apiClient.get("/appointments/my-appointments", {
                    params: { month: currentMonth }
                });

                const allAppointments = response.data?.content || [];

                const todayAppointments = allAppointments.filter((apt: Appointment) => {
                    const aptDate = apt.expected_at.split('T')[0];
                    return aptDate === todayStr;
                });

                const weekAppointments = allAppointments.filter((apt: Appointment) => {
                    const aptDate = apt.expected_at.split('T')[0];
                    return aptDate >= todayStr && aptDate <= weekEndStr;
                });

                const pendingAppointments = allAppointments.filter((apt: Appointment) =>
                    apt.status === "SCHEDULED" || apt.status === "IN_PROGRESS"
                );

                const monthAppointments = allAppointments.filter((apt: Appointment) => {
                    const aptMonth = apt.expected_at.substring(0, 7);
                    return aptMonth === currentMonth && apt.status === "COMPLETED";
                });

                setAppointments(allAppointments);
                setStats({
                    todayCount: todayAppointments.length,
                    weekCount: weekAppointments.length,
                    pendingConsultations: pendingAppointments.length,
                    completedThisMonth: monthAppointments.length
                });
                setError(null);
            } catch (err) {
                console.error("Error fetching doctor data:", err);
                setError("Error al cargar los datos");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [doctorId]);

    const scheduledAppointments = appointments.filter(apt => apt.status === "SCHEDULED");

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "numeric",
            month: "short"
        });
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "SCHEDULED": return "Programada";
            case "IN_PROGRESS": return "En Progreso";
            case "COMPLETED": return "Completada";
            case "CANCELLED": return "Cancelada";
            case "PENDING_PAYMENT": return "Pendiente Pago";
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SCHEDULED": return "bg-primary/10 text-primary";
            case "IN_PROGRESS": return "bg-warning/10 text-warning";
            case "COMPLETED": return "bg-success/10 text-success";
            case "CANCELLED": return "bg-danger/10 text-danger";
            case "PENDING_PAYMENT": return "bg-amber-100 text-amber-700";
            default: return "bg-surface-alt text-text-muted";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">

                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-6 md:p-8 text-white shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        ¡Bienvenido, Dr. {user?.name || "Doctor"}!
                    </h1>
                    <p className="text-white/80">
                        Panel de Gestión de Consultas
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-100">
                                <Calendar className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Citas Hoy</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{stats.todayCount}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Esta Semana</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{stats.weekCount}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <CheckCircle className="h-5 w-5 text-warning" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Completadas Mes</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{stats.completedThisMonth}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-danger/10">
                                <Monitor className="h-5 w-5 text-danger" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Pendientes</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{stats.pendingConsultations}</p>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Acciones Rápidas</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to={`/doctor/schedule/${doctorId}`}
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            <Calendar className="h-4 w-4" />
                            Ver Calendario
                        </Link>
                        <Link
                            to={`/doctor/schedule/${doctorId}`}
                            className="flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl hover:opacity-90 transition-colors"
                        >
                            <FileMedical className="h-4 w-4" />
                            Completar Consulta
                        </Link>
                        <button
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt text-text rounded-xl hover:bg-gray-200 transition-colors border border-surface-alt"
                        >
                            <User className="h-4 w-4" />
                            Mi Perfil
                        </button>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-text">Próximas Citas</h2>
                        <Link
                            to={`/doctor/schedule/${doctorId}`}
                            className="text-sm text-primary hover:underline"
                        >
                            Ver todas
                        </Link>
                    </div>

                    {error ? (
                        <div className="text-center py-8 text-danger">
                            <p>{error}</p>
                        </div>
                    ) : scheduledAppointments.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No tienes citas programadas</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {scheduledAppointments.slice(0, 5).map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-surface-alt hover:bg-surface-alt/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:block p-3 rounded-full bg-primary/10">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-text">{apt.patient_name}</p>
                                            <p className="text-sm text-text-muted">
                                                {formatDate(apt.expected_at)} • {formatTime(apt.expected_at)}
                                            </p>
                                            {apt.notes && (
                                                <p className="text-sm text-text-muted mt-1">{apt.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {apt.meeting_link && (
                                            <a
                                                href={apt.meeting_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                                title="Unirse a Meet"
                                            >
                                                <Monitor className="h-5 w-5" />
                                            </a>
                                        )}
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                            {getStatusLabel(apt.status)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Herramientas de Consulta</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-surface-alt hover:bg-surface-alt/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-primary/10">
                                    <FileMedical className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-medium text-text">Historia Clínica</h3>
                            </div>
                            <p className="text-sm text-text-muted">
                                Registrar diagnóstico, notas clínicas y examen físico del paciente.
                            </p>
                        </div>
                        <div className="p-4 rounded-xl border border-surface-alt hover:bg-surface-alt/30 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 rounded-lg bg-success/10">
                                    <Pill className="h-5 w-5 text-success" />
                                </div>
                                <h3 className="font-medium text-text">Receta Médica</h3>
                            </div>
                            <p className="text-sm text-text-muted">
                                Crear recetas digitales con medicamentos y dosage instrucciones.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DoctorHomePage;