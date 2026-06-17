import { useState, useEffect, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { 
  format, 
  parse, 
  startOfWeek, 
  getDay, 
  eachDayOfInterval, 
  startOfMonth, 
  endOfMonth, 
  endOfWeek,
  subDays,
  addDays
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Appointment } from "@/features/utils/Appointment";
import type { Doctor, Speciality } from "@/features/utils/Employees";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
import { useDoctorSchedule } from "../hooks/useDoctorSchedule";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

function jsDayToEnum(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

interface BookingModalProps {
  doctor: Doctor;
  appointments: Appointment[];
  onBook: (appointment: Appointment) => void;
  onClose: () => void;
}

function BookingModal({ doctor, appointments, onBook, onClose }: BookingModalProps) {
  const [currentView, setCurrentView] = useState<View>(Views.WEEK);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  const { schedule, getSchedule } = useDoctorSchedule();

  useEffect(() => {
    if (doctor?.id) {
      getSchedule(String(doctor.id));
    }
  }, [doctor?.id, getSchedule]);

  const visibleRange = useMemo(() => {
    let start = currentDate;
    let end = currentDate;

    if (currentView === Views.MONTH) {
      start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
      end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
    } else if (currentView === Views.WEEK) {
      start = startOfWeek(currentDate, { weekStartsOn: 0 });
      end = endOfWeek(currentDate, { weekStartsOn: 0 });
    }

    return {
      start: subDays(start, 7),
      end: addDays(end, 7)
    };
  }, [currentDate, currentView]);

  const combinedEvents = useMemo(() => {
    const busyEvents = appointments.map((apt) => ({
      title: "Ocupado",
      start: new Date(apt.expected_at),
      end: new Date(new Date(apt.expected_at).getTime() + 60 * 60 * 1000),
      isOfficeHour: false,
    }));

    if (!schedule || schedule.length === 0) return busyEvents;

    const generatedOfficeHours: any[] = [];
    try {
      const allDaysInRange = eachDayOfInterval({ start: visibleRange.start, end: visibleRange.end });

      allDaysInRange.forEach((dateInstance) => {
        const currentDayEnum = jsDayToEnum(dateInstance.getDay());
        const matchingShifts = schedule.filter((s) => s.day === currentDayEnum && s.isActive);

        matchingShifts.forEach((shift) => {
          const dateYMD = format(dateInstance, "yyyy-MM-dd");
          const cleanStart = shift.startTime.split("+")[0];
          const cleanEnd = shift.endTime.split("+")[0];

          generatedOfficeHours.push({
            title: "Horario Disponible",
            start: new Date(`${dateYMD}T${cleanStart}`),
            end: new Date(`${dateYMD}T${cleanEnd}`),
            isOfficeHour: true,
          });
        });
      });
    } catch (e) {
      console.error("Error expanding recurring schedule parameters:", e);
    }

    return [...busyEvents, ...generatedOfficeHours];
  }, [appointments, schedule, visibleRange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const appointment: Appointment = {
      id: Date.now(),
      patient_id: 1,
      patient_name: "Paciente",
      employee_id: doctor.id,
      doctor_name: `${doctor.first_name} ${doctor.last_name}`,
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
              {doctor.first_name} {doctor.last_name} ·{" "}
              <span className="text-accent">
                {doctor.specialties.map((esp: Speciality) => esp.name).join(", ")}
              </span>
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text transition-colors text-xl leading-none cursor-pointer">
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
                events={combinedEvents}
                startAccessor="start"
                endAccessor="end"
                toolbar={true}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                defaultView={Views.WEEK}
                view={currentView}
                date={currentDate}
                onView={setCurrentView}
                onNavigate={setCurrentDate}
                popup
                selectable
                onSelectSlot={(slot) => {
                  const d = slot.start;
                  setDate(format(d, "yyyy-MM-dd"));
                  setTime(format(d, "HH:mm"));
                }}
                eventPropGetter={(event: any) => {
                  if (event.isOfficeHour) {
                    return {
                      style: {
                        backgroundColor: "rgba(16, 185, 129, 0.12)",
                        borderColor: "#10b981",
                        color: "#065f46",
                        fontSize: "11px",
                        fontWeight: 600,
                        borderStyle: "dashed"
                      },
                    };
                  }
                  return {
                    style: {
                      backgroundColor: "#dc2626",
                      borderColor: "#dc2626",
                      color: "#fff",
                      fontSize: "11px",
                    },
                  };
                }}
              />
            </div>
          </div>

          {/* Form Side Desk Pane */}
          <div className="w-80 p-6 flex flex-col gap-4 overflow-auto">
            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
              Nueva cita
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Fecha</label>
                <input required type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Hora</label>
                <input required type="time" value={time} onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Notas (opcional)</label>
                <textarea rows={4} placeholder="Describa brevemente el motivo de la consulta..." value={notes} onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary resize-none text-text placeholder-text-muted" />
              </div>

              <p className="text-[11px] text-text-muted leading-relaxed">
                <FontAwesomeIcon icon={faLightbulb}/> También puedes hacer clic en un horario en el calendario para pre-llenar la fecha y hora.
              </p>

              <button type="submit" className="w-full bg-primary text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer">
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