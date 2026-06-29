import { DayOfTheWeek } from "@/features/utils/DaysOfTheWeek";
import type { OfficeHours } from "@/features/utils/OfficeHours";
import { eachDayOfInterval, format } from "date-fns";

function jsDayToEnum(jsDay: number): DayOfTheWeek {
  return jsDay === 0 ? DayOfTheWeek.SUNDAY : (jsDay - 1);
}

export function generateCalendarHours(
  startDate: Date,
  endDate: Date,
  officeHoursList: OfficeHours[]
) {
  const allDaysInRange = eachDayOfInterval({ start: startDate, end: endDate });
  const generatedEvents: any[] = [];

  allDaysInRange.forEach((dateInstance) => {
    const currentDayEnum = jsDayToEnum(dateInstance.getDay());

    const matchingHours = officeHoursList.filter(h => h.day === currentDayEnum);

    matchingHours.forEach((hours) => {
      const dateYMD = format(dateInstance, "yyyy-MM-dd");
      
      const cleanStart = hours.startTime.split("+")[0];
      const cleanEnd = hours.endTime.split("+")[0];

      generatedEvents.push({
        title: "Horario de Atención",
        start: new Date(`${dateYMD}T${cleanStart}`),
        end: new Date(`${dateYMD}T${cleanEnd}`),
        isOfficeHour: true,
      });
    });
  });

  return generatedEvents;
}