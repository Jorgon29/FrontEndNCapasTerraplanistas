import type { Appointment } from "@/features/utils/Appointment";

import {
  CalendarDays,
  Clock,
  Video,
} from "lucide-react";

interface AppointmentCardProps {
  appointment: Appointment;

  onJoin: () => void;
}

export default function AppointmentCard({
  appointment,
  onJoin,
}: AppointmentCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
        flex
        flex-col
        gap-4
      "
    >
      <div className="flex justify-between">
        <div>
          <h2 className="text-xl font-bold">
            {appointment.patient_name}
          </h2>

          <p className="text-gray-500">
            {appointment.doctor_name}
          </p>
        </div>

        <span
          className="
            bg-blue-100
            text-blue-700
            px-3
            py-1
            rounded-full
            text-sm
            h-fit
          "
        >
          {appointment.status}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={18} />

          <p>
            {new Date(
              appointment.expected_at
            ).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Clock size={18} />

          <p>
            {new Date(
              appointment.expected_at
            ).toLocaleTimeString()}
          </p>
        </div>
      </div>

      <button
        onClick={onJoin}
        className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          rounded-xl
          p-3
          flex
          items-center
          justify-center
          gap-2
          transition
        "
      >
        <Video size={18} />

        Join Call
      </button>
    </div>
  );
}