// pages/DoctorSchedulePage.tsx
import { useParams } from "react-router";
import ScheduleCalendar from "@/features/doctorSchedule/components/ScheduleCalendar";
import ConsultationModal from "@/features/doctorSchedule/components/ConsultationModal";

function DoctorSchedulePage() {
  const { uuid } = useParams<{ uuid: string }>();

  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

  return (
      <ScheduleCalendar
        endpoint={`/appointments/my-appointments?month=${currentMonth}`}
        Modal={ConsultationModal}
      />
  );
}

export default DoctorSchedulePage;