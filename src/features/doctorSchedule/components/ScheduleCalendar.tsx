import { useState, useCallback, useRef } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import type { Appointment } from "@/features/utils/Appointment";
import BASE_URL from "@/config/config";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface ScheduleCalendarProps {
  endpoint: string;
  eventTitle?: (apt: Appointment) => string;
  Modal: React.ComponentType<{ appointment: Appointment | null; onClose: () => void }>;
  onEventClick?: (apt: Appointment) => void;
}

export default function ScheduleCalendar({ endpoint, eventTitle, Modal, onEventClick }: ScheduleCalendarProps) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const lastNavigateTime = useRef<number>(0);

  const fetchMonth = useCallback(async (date: Date) => {
    const monthParam = format(date, "yyyy-MM");
    console.log("[Calendar] Fetching:", monthParam);

    setIsLoading(true);
    setError(null);

    const baseEndpoint = endpoint.split('?')[0];
    const url = `${BASE_URL}${baseEndpoint}?month=${monthParam}`;
    console.log("[Calendar] Full URL:", url);

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      const rawArray = data?.content || data || [];
      const mapped: Appointment[] = rawArray.map((apt: any) => ({
        id: apt.id,
        patient_id: apt.patientId || apt.patient_id,
        patient_name: apt.patientName || apt.patient_name,
        employee_id: apt.employeeId || apt.employee_id,
        doctor_name: apt.doctorName || apt.doctor_name,
        expected_at: apt.expectedAt || apt.expected_at,
        status: apt.statusName || apt.status,
        meeting_link: apt.meetingLink || apt.meeting_link,
        notes: apt.notes,
        score: apt.score,
        review: apt.review,
      }));
      setAppointments(mapped);
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("No se pudieron cargar las citas. Intenta de nuevo más tarde.");
    } finally {
      setIsLoading(false);
    }
  }, [endpoint]);

  const handleNavigate = useCallback((date: Date) => {
    const now = Date.now();
    const monthParam = format(date, "yyyy-MM");
    console.log("[Calendar] handleNavigate:", monthParam, "time since last:", now - lastNavigateTime.current);

    if (now - lastNavigateTime.current < 300) {
      console.log("[Calendar] Debounce - ignoring rapid call");
      return;
    }
    lastNavigateTime.current = now;

    setCurrentDate(date);
    fetchMonth(date);
  }, [fetchMonth]);

  const handleModalClose = () => {
    setSelectedAppointment(null);
    if (currentDate) {
      fetchMonth(currentDate);
    }
  };

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
          <p className="text-sm font-medium text-text">Cargando citas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-175 items-center justify-center rounded-2xl bg-background shadow-md">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-danger font-medium">{error}</p>
          <button
            onClick={() => currentDate && fetchMonth(currentDate)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
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
          onNavigate={handleNavigate}
          popup
          selectable
          onSelectEvent={(event) => {
            if (onEventClick) {
              onEventClick(event.resource);
            } else {
              setSelectedAppointment(event.resource);
            }
          }}
        />
      </div>
      <Modal
        appointment={selectedAppointment}
        onClose={handleModalClose}
      />
    </div>
  );
}