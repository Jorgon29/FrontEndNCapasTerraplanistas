import type { Appointment } from "@/features/utils/Appointment";

import AppointmentCard from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];

  onJoin: (appointment: Appointment) => void;
}

export default function AppointmentList({
  appointments,
  onJoin,
}: AppointmentListProps) {
  return (
    <div className="grid gap-4">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onJoin={() =>
            onJoin(appointment)
          }
        />
      ))}
    </div>
  );
}