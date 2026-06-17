// pages/DoctorSchedulePage.tsx
import { useParams } from "react-router";
import ScheduleCalendar from "@/features/doctorSchedule/components/ScheduleCalendar";
import ConsultationModal from "@/features/doctorSchedule/components/ConsultationModal";

function DoctorSchedulePage() {
  const { uuid } = useParams<{ uuid: string }>();

  if (!uuid) {
    return <div className="text-center p-8 text-text">ID de doctor no proporcionado.</div>;
  }

  return (
      <ScheduleCalendar
        endpoint={`/api/appointments/doctor/${uuid}`}
        Modal={ConsultationModal}
      />
  );
}

export default DoctorSchedulePage;