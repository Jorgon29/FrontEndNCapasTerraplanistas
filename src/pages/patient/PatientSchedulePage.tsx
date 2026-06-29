import { useNavigate } from "react-router-dom";
import ScheduleCalendar from "@/features/doctorSchedule/components/ScheduleCalendar";
import PatientConsultationModal from "@/features/patient/PatientConsultationModal";

function PatientSchedulePage() {
    const navigate = useNavigate();

    const handleEventClick = (apt: any) => {
        if (apt.status === "COMPLETED") {
            navigate("/patient/medical-records");
        }
    };

    return (
        <ScheduleCalendar
            endpoint="/appointments/my-appointments"
            eventTitle={(apt) => `Dr. ${apt.doctor_name} - ${apt.notes || "Cita"}`}
            Modal={PatientConsultationModal}
            onEventClick={handleEventClick}
        />
    );
}

export default PatientSchedulePage;