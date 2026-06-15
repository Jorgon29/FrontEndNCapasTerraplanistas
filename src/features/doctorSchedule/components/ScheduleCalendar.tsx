import { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Appointment } from "@/features/utils/Appointment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import ConsultationModal from "./ConsultationModal";
import BASE_URL from "@/config/config";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DUMMY_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    patient_id: 1,
    patient_name: "Juan Pérez",
    employee_id: 1,
    doctor_name: "Dr. Carlos Gómez",
    expected_at: "2026-06-20T10:00:00",
    status: "SCHEDULED",
    meeting_link: "https://meet.fake/abc123",
    notes: "Consulta cardiológica",
  },
  {
    id: 2,
    patient_id: 2,
    patient_name: "Ana Martínez",
    employee_id: 1,
    doctor_name: "Dr. Carlos Gómez",
    expected_at: "2026-06-21T15:30:00",
    status: "COMPLETED",
    meeting_link: "https://meet.fake/xyz789",
    notes: "Control médico",
  },
];

interface ScheduleCalendarProps {
  doctorUuid: string;
}

function ScheduleCalendar({ doctorUuid }: ScheduleCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isUsingMock, setIsUsingMock] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/appointments/doctor/${doctorUuid}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          throw new Error(`API returned status ${response.status}`);
        }

        const data = await response.json();
        setAppointments(data);
        setIsUsingMock(false);
      } catch (err) {
        console.warn(
          `Conexión con la API falló. Cargando datos de prueba locales para el doctor: ${doctorUuid}`,
          err
        );
        setAppointments(DUMMY_APPOINTMENTS);
        setIsUsingMock(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorUuid]);

  const events = appointments.map((appointment) => ({
    title: `${appointment.patient_name} - ${appointment.notes || "Cita"}`,
    start: new Date(appointment.expected_at),
    end: new Date(new Date(appointment.expected_at).getTime() + 60 * 60 * 1000),
    resource: appointment,
  }));

  if (isLoading) {
    return (
      <div className="bg-background p-4 rounded-2xl shadow-md overflow-visible" style={{ height: "700px" }}>
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm font-medium text-text">Verificando servidor de datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {isUsingMock && (
        <div className="w-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide text-center uppercase">
          <FontAwesomeIcon icon={faTriangleExclamation} /> Modo de Desarrollo: Backend desconectado. Visualizando datos simulados (Mock Data).
        </div>
      )}

      <div className="bg-background p-4 rounded-2xl shadow-md" style={{ height: "700px" }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          toolbar={true}
          defaultView={Views.MONTH}
          defaultDate={new Date()}
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          popup
          selectable
          onSelectEvent={(event) => setSelectedAppointment(event.resource)}
          view={currentView}
          date={currentDate}
          onView={(view) => setCurrentView(view)}
          onNavigate={(date) => setCurrentDate(date)}
        />
      </div>

      <ConsultationModal
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </div>
  );
}

export default ScheduleCalendar;