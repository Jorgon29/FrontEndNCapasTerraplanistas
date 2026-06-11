// pages/DoctorSchedulePage.tsx
import { useParams } from "react-router";
import ScheduleCalendar from "@/features/doctorSchedule/components/ScheduleCalendar";

function DoctorSchedulePage() {
  const { uuid } = useParams<{ uuid: string }>();

  if (!uuid) {
    return <div className="text-center p-8 text-text">ID de doctor no proporcionado.</div>;
  }

  return (
    <>
      <ScheduleCalendar doctorUuid={uuid} />
    </>
  );
}

export default DoctorSchedulePage;