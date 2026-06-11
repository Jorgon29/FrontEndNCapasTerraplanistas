import {
  Calendar,
  dateFnsLocalizer,
  Views,
} from "react-big-calendar";


import {
  format,
  parse,
  startOfWeek,
  getDay,
} from "date-fns";

import { enUS } from "date-fns/locale";

import type { Appointment } from "@/features/utils/Appointment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer =
  dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });

interface AppointmentCalendarProps {
  appointments: Appointment[];
}

export default function AppointmentCalendar({
  appointments,
}: AppointmentCalendarProps) {
  const events = appointments.map(
    (appointment) => ({
      title:
        appointment.patient_name,

      start: new Date(
        appointment.expected_at
      ),

      end: new Date(
        new Date(
          appointment.expected_at
        ).getTime() +
          60 * 60 * 1000
      ),
    })
  );

  return (
    <div
      className="
        bg-background
        p-4
        rounded-2xl
        shadow-md
      "
      style={{ height: "700px" }}
    >
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"

        toolbar={true}

        views={[
          Views.MONTH,
          Views.WEEK,
          Views.DAY,
          Views.AGENDA,
        ]}

        popup

        selectable

        onSelectEvent={(event) => {
          console.log(event);
        }}

        onSelectSlot={(slotInfo) => {
          console.log(slotInfo);
        }}
      />
    </div>
  );
}