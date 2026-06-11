import { useState } from "react";

import type { Appointment } from "@/features/utils/Appointment";

interface AppointmentFormProps {
  onCreate: (
    appointment: Appointment
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

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const appointment: Appointment = {
      id: Date.now(),

      patient_id: 1,

      patient_name: patientName,

      employee_id: 1,

      doctor_name:
        "Dr. Carlos Gómez",

      expected_at:
        `${date}T${time}:00`,

      status: "SCHEDULED",

      meeting_link:
        "https://meet.fake/" +
        Math.random()
          .toString(36)
          .substring(7),

      notes,
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
          min-h-[120px]
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