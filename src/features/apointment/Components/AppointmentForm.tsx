import { useState } from "react";

import type { Appointment } from "@/features/utils/Appointment";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import type { AppointmentRequest } from "@/features/utils/AppointmentRequest";

interface AppointmentFormProps {
  onCreate: (
    appointment: AppointmentRequest
  ) => void;
}

export default function AppointmentForm({
  onCreate,
}: AppointmentFormProps) {
  const [patientName, setPatientName] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [notes, setNotes] =
    useState("");

  const { doctor } = useAuth();

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!doctor || !doctor.specialties[0]) {
      return <></>
    }

    const appointment: AppointmentRequest = {

      patientId: "1111-1111-1111-1111",

      score: null,

      review: null,

      patientCallerUserId: "1111-1111-1111-1111",

      employeeId: doctor?.employee_id,

      expectedAt:
        `${date}T${time}:00`,

      registeredAt: new Date().toISOString(),

      status: "SCHEDULED",

      finalFeePerHour: doctor.specialties[0]?.feePerHour,

      googleEventId: "awdad"

    };

    onCreate(appointment);

    setPatientName("");
    setDate("");
    setTime("");
    setNotes("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        bg-background
        rounded-2xl
        shadow-md
        p-6
        grid
        gap-4
      "
    >
      <h2 className="text-2xl font-bold">
        Agendar cita
      </h2>

      <input
        type="text"
        placeholder="Nombre paciente"
        value={patientName}
        onChange={(e) =>
          setPatientName(
            e.target.value
          )
        }
        className="
          border
          rounded-xl
          p-3
        "
      />

      <input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
        className="
          border
          rounded-xl
          p-3
        "
      />

      <input
        type="time"
        value={time}
        onChange={(e) =>
          setTime(e.target.value)
        }
        className="
          border
          rounded-xl
          p-3
        "
      />

      <textarea
        placeholder="Notas"
        value={notes}
        onChange={(e) =>
          setNotes(e.target.value)
        }
        className="
          border
          rounded-xl
          p-3
          min-h-30
        "
      />

      <button
        type="submit"
        className="
          bg-primary
          text-background
          rounded-xl
          p-3
        "
      >
        Guardar cita
      </button>
    </form>
  );
}