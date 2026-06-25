import { useAuth } from "@/features/auth/providers/AuthProvider";
import apiClient from "@/lib/apiClient";
import { Appointment } from "@/features/utils/Appointment";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Calendar, Clock, CheckCircle, CalendarDays, Search, User, Loader2 } from "lucide-react";

function PatientHomePage() {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                setIsLoading(true);
                const currentDate = new Date();
                const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;

                const response = await apiClient.get("/appointments/my-appointments", {
                    params: { month: currentMonth }
                });
                setAppointments(response.data?.content || []);
                setError(null);
            } catch (err) {
                console.error("Error fetching appointments:", err);
                setError("Error al cargar las citas");
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, []);

    const scheduledAppointments = appointments.filter(apt => apt.status === "SCHEDULED");
    const completedAppointments = appointments.filter(apt => apt.status === "COMPLETED");

    const nextAppointment = scheduledAppointments[0];
    const upcomingCount = scheduledAppointments.length;
    const completedCount = completedAppointments.length;
    const totalThisMonth = appointments.length;

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
            case "COMPLETED": return "Completada";
            case "CANCELLED": return "Cancelada";
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SCHEDULED": return "bg-primary/10 text-primary";
            case "COMPLETED": return "bg-success/10 text-success";
            case "CANCELLED": return "bg-danger/10 text-danger";
            default: return "bg-surface-alt text-text-muted";
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-6">

                <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-6 md:p-8 text-white shadow-lg">
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">
                        ¡Bienvenido, {user?.name || "Paciente"}!
                    </h1>
                    <p className="text-white/80">
                        Aquí está el resumen de tu actividad
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Próximas Citas</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{upcomingCount}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-success/10">
                                <CheckCircle className="h-5 w-5 text-success" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Completadas</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{completedCount}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CalendarDays className="h-5 w-5 text-primary" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Total del Mes</span>
                        </div>
                        <p className="text-3xl font-bold text-text">{totalThisMonth}</p>
                    </div>

                    <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-warning/10">
                                <Clock className="h-5 w-5 text-warning" />
                            </div>
                            <span className="text-text-muted text-sm font-medium">Próxima Cita</span>
                        </div>
                        {nextAppointment ? (
                            <div>
                                <p className="text-lg font-bold text-text">{formatDate(nextAppointment.expected_at)}</p>
                                <p className="text-sm text-text-muted">{formatTime(nextAppointment.expected_at)}</p>
                            </div>
                        ) : (
                            <p className="text-lg font-bold text-text-muted">Sin citas</p>
                        )}
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Acciones Rápidas</h2>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/patient/search"
                            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
                        >
                            <Search className="h-4 w-4" />
                            Buscar Doctor
                        </Link>
                        <Link
                            to="/patient/calendar"
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt text-text rounded-xl hover:bg-gray-200 transition-colors border border-surface-alt"
                        >
                            <Calendar className="h-4 w-4" />
                            Ver Calendario
                        </Link>
                        <Link
                            to="/patient/profile"
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-alt text-text rounded-xl hover:bg-gray-200 transition-colors border border-surface-alt"
                        >
                            <User className="h-4 w-4" />
                            Mi Perfil
                        </Link>
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-text mb-4">Citas Recientes</h2>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8 text-danger">
                            <p>{error}</p>
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-8 text-text-muted">
                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>No tienes citas este mes</p>
                            <Link
                                to="/patient/search"
                                className="text-primary hover:underline mt-2 inline-block"
                            >
                                Buscar un doctor
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {appointments.slice(0, 5).map((apt) => (
                                <div
                                    key={apt.id}
                                    className="flex items-center justify-between p-4 rounded-xl border border-surface-alt hover:bg-surface-alt/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:block p-3 rounded-full bg-primary/10">
                                            <Calendar className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-text">{apt.doctor_name}</p>
                                            <p className="text-sm text-text-muted">
                                                {formatDate(apt.expected_at)} • {formatTime(apt.expected_at)}
                                            </p>
                                            {apt.notes && (
                                                <p className="text-sm text-text-muted mt-1">{apt.notes}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientHomePage;