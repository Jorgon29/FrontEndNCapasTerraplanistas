import { useState } from "react";
import PatientDoctorSearch from "./PatientDoctorSearch";
import BookingModal from "@/features/search/Components/BookingModal";
import type { PublicDoctor } from "@/features/search/hooks/usePatientDoctors";

function PatientSearchPage() {
  const [selectedDoctor, setSelectedDoctor] = useState<PublicDoctor | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Buscar Doctores
          </h1>
          <p className="text-gray-500 mt-2">
            Busca por nombre o especialidad
          </p>
        </div>

        <PatientDoctorSearch
          onInteract={(doctor: PublicDoctor) => {
            setSelectedDoctor(doctor);
          }}
        />

        {selectedDoctor && (
          <BookingModal
            doctor={selectedDoctor}
            appointments={[]}
            onBook={(appointment) => {
              console.log("Appointment booked:", appointment);
              setSelectedDoctor(null);
            }}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </div>
    </div>
  );
}

export default PatientSearchPage;