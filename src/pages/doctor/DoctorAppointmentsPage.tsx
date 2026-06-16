import { useState } from "react";

import type { Appointment } from "@/features/utils/Appointment";

import { appointments as initialAppointments } 
from "@/features/utils/Appointment"

import AppointmentForm from "@/features/apointment/Components/AppointmentForm";

import AppointmentList from "@/features/apointment/Components/AppointmentList";

import AppointmentCalendar from "@/features/apointment/Components/AppointmentCalendar";

import VideoCallModal from "@/features/apointment/VideoCallModal";

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] =
    useState<Appointment[]>(
      initialAppointments
    );

  const [selectedAppointment,
    setSelectedAppointment]
    = useState<Appointment | null>(
      null
    );

  const handleCreateAppointment =
    (appointment: Appointment) => {
      setAppointments((prev) => [
        appointment,
        ...prev,
      ]);
    };

  return (
    <div className="min-h-screen bg-background">
      <div
        className="
          max-w-7xl
          mx-auto
          p-6
          grid
          lg:grid-cols-2
          gap-6
        "
      >
        <div className="flex flex-col gap-6">
          
          <AppointmentForm
            onCreate={
              handleCreateAppointment
            }
          />

          <AppointmentList
            appointments={
              appointments
            }
            onJoin={(appointment) =>
              setSelectedAppointment(
                appointment
              )
            }
          />
        </div>

        <AppointmentCalendar
          appointments={appointments}
        />
      </div>

      <VideoCallModal
        appointment={
          selectedAppointment
        }
        onClose={() =>
          setSelectedAppointment(
            null
          )
        }
      />
    </div>
  );
}