import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Appointment } from "@/features/utils/Appointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import BASE_URL from "@/config/config";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: "adad", patient_id: "awdaddsf", patient_name: "Juan Pérez", employee_id: "asdasd",
    doctor_name: "Carlos Gómez", expected_at: "2026-06-20T10:00:00",
    status: "SCHEDULED", meeting_link: "https://meet.fake/abc123", notes: "Consulta cardiológica",
  },
  {
    id: "asdasdad", patient_id: "fasdadasd", patient_name: "Ana Martínez", employee_id: "asdadawd",
    doctor_name: "Carlos Gómez", expected_at: "2026-06-21T15:30:00",
    status: "COMPLETED", meeting_link: "https://meet.fake/xyz789", notes: "Control médico",
  },
];

interface ScheduleCalendarProps {
  endpoint: string;
  eventTitle?: (apt: Appointment) => string;
  Modal: React.ComponentType<{ appointment: Appointment | null; onClose: () => void }>;
}

export default function ScheduleCalendar({ endpoint, eventTitle, Modal }: ScheduleCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUsingMock, setIsUsingMock] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetch_ = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error();
        setAppointments(await res.json());
        setIsUsingMock(false);
      } catch {
        setAppointments(DUMMY_APPOINTMENTS);
        setIsUsingMock(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetch_();
  }, [endpoint]);

  const defaultTitle = (apt: Appointment) => `${apt.patient_name} - ${apt.notes || "Cita"}`;

  const events = appointments.map((apt) => ({
    title: (eventTitle ?? defaultTitle)(apt),
    start: new Date(apt.expected_at),
    end: new Date(new Date(apt.expected_at).getTime() + 60 * 60 * 1000),
    resource: apt,
  }));

  if (isLoading) {
    return (
      <div className="flex h-175 items-center justify-center rounded-2xl bg-background shadow-md">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-text">Verificando servidor de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isUsingMock && (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-center uppercase">
          <FontAwesomeIcon icon={faTriangleExclamation} /> Modo de Desarrollo: Backend desconectado. Visualizando datos simulados.
        </div>
      )}
      <div className="bg-background p-4 rounded-2xl shadow-md" style={{ height: "700px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          toolbar={true}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={currentView}
          date={currentDate}
          onView={setCurrentView}
          onNavigate={setCurrentDate}
          popup
          selectable
          onSelectEvent={(event) => setSelectedAppointment(event.resource)}
        />
      </div>
      <Modal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}