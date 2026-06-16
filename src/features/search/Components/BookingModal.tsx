import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Appointment } from "@/features/utils/Appointment";
import type { Doctor, Speciality } from "@/features/utils/Employees";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface BookingModalProps {
    doctor: Doctor;
    appointments: Appointment[];
    onBook: (appointment: Appointment) => void;
    onClose: () => void;
}

function BookingModal({ doctor, appointments, onBook, onClose }: BookingModalProps) {
    const [currentView, setCurrentView] = useState<View>(Views.MONTH);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const events = appointments.map((apt) => ({
        title: "Ocupado",
        start: new Date(apt.expected_at),
        end: new Date(new Date(apt.expected_at).getTime() + 60 * 60 * 1000),
    }));

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const appointment: Appointment = {
            id: Date.now(),
            patient_id: 1,
            patient_name: "Paciente",
            employee_id: doctor.id,
            doctor_name: doctor.first_name + " " + doctor.last_name,
            expected_at: `${date}T${time}:00`,
            status: "SCHEDULED",
            meeting_link: "https://meet.fake/" + Math.random().toString(36).substring(7),
            notes,
        };
        onBook(appointment);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background text-text rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-surface-alt">

                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt">
                    <div>
                        <h2 className="text-lg font-semibold text-text">Agendar cita</h2>
                        <p className="text-xs text-text-muted mt-0.5">
                            {doctor.first_name + " " + doctor.last_name} · {" "}
                            <span className="text-accent">
                                {doctor.specialties.map((esp: Speciality) => esp.name).join(", ")}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-text-muted hover:text-text transition-colors text-xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="flex-1 p-4 border-r border-surface-alt overflow-auto">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
                            Disponibilidad del doctor
                        </p>
                        <div style={{ height: "520px" }}>
                            <Calendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                toolbar={true}
                                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                                view={currentView}
                                date={currentDate}
                                onView={setCurrentView}
                                onNavigate={setCurrentDate}
                                popup
                                selectable
                                onSelectSlot={(slot) => {
                                    const d = slot.start;
                                    setDate(d.toISOString().split("T")[0] ?? "");
                                    setTime(d.toTimeString().slice(0, 5) ?? "");
                                }}
                                eventPropGetter={() => ({
                                    style: {
                                        backgroundColor: "#dc2626",
                                        borderColor: "#dc2626",
                                        color: "#fff",
                                        fontSize: "11px",
                                    },
                                })}
                            />
                        </div>
                    </div>

                    {/* right — booking form */}
                    <div className="w-80 p-6 flex flex-col gap-4 overflow-auto">
                        <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                            Nueva cita
                        </p>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                    Fecha
                                </label>
                                <input
                                    required
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                    Hora
                                </label>
                                <input
                                    required
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                    Notas (opcional)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describa brevemente el motivo de la consulta..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none text-text placeholder-text-muted"
                                />
                            </div>

                            <p className="text-[11px] text-text-muted leading-relaxed">
                                💡 También puedes hacer clic en un horario en el calendario para pre-llenar la fecha y hora.
                            </p>

                            <button
                                type="submit"
                                className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors"
                            >
                                Confirmar cita
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingModal;
