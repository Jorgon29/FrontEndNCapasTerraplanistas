import { useState } from "react";
import DoctorSearchPage from "../doctor/DoctorSearchPage";
import BookingModal from "@/features/search/Components/BookingModal";
import type { Appointment } from "@/features/utils/Appointment";
import type { Doctor } from "@/features/utils/Employees";
import type { AppointmentRequest } from "@/features/utils/AppointmentRequest";

function PatientSearchPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorAppointments] = useState<Appointment[]>([]);

  return (
    <div className="min-h-screen bg-background font-sans text-text">
      <DoctorSearchPage
        onInteract={(arg0: Doctor) => {setSelectedDoctor(arg0);}}
      />

      {selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          appointments={doctorAppointments}
          onBook={(appointment: AppointmentRequest) => {
            console.log("Booking appointment:", appointment);
          }}
          onClose={() => setSelectedDoctor(null)}
        />
      )}
    </div>
  );
}

export default PatientSearchPage;
