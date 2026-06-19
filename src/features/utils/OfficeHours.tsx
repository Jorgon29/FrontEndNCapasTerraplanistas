import type { DayOfTheWeek } from "./DaysOfTheWeek";

export interface OfficeHours {
  id?: string;
  day: DayOfTheWeek;
  startTime: string;
  endTime: string;
}

export interface BackendOfficeHourDTO {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}