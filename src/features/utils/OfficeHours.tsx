import type { DayOfTheWeek } from "./DaysOfTheWeek";

export interface OfficeHours {
  day: DayOfTheWeek;
  startTime: string;
  endTime: string;
}

export interface BackendOfficeHourDTO {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}