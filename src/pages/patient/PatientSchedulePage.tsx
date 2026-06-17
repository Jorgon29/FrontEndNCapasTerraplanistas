import { useAuth } from "@/features/auth/providers/AuthProvider";
import ScheduleCalendar from "@/features/doctorSchedule/components/ScheduleCalendar";
import PatientConsultationModal from "@/features/patient/PatientConsultationModal";

function PatientSchedulePage() {

    const {patient} = useAuth();

    return (
        <ScheduleCalendar
            endpoint={`/api/appointments/patient/${patient?.id}`}
            eventTitle={(apt) => `Dr. ${apt.doctor_name} - ${apt.notes || "Cita"}`}
            Modal={PatientConsultationModal}
        />
    );
}

export default PatientSchedulePage;