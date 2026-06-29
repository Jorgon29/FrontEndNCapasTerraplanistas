import { useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";
import { ENV } from "@/config/config";
import { DayOfTheWeek, englishStringToDay } from "@/features/utils/DaysOfTheWeek";

export interface OfficeHours {
  id: string;
  employeeId: string;
  specialtyId: string;
  day: DayOfTheWeek;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  googleEventId: string | null;
  status: string;
  finalFeePerHour: number;
  score: number | null;
  review: string | null;
  registeredAt: string;
  expectedAt: string;
  employeeId: string;
  patientId: string;
  patientCallerUserId: string;
}

export function useDoctorSchedule() {
  const [schedule, setSchedule] = useState<OfficeHours[]>([]);
  const [isScheduleLoading, setIsScheduleLoading] = useState<boolean>(false);
  const [scheduleError, setScheduleError] = useState<string | null>(null);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isAppointmentsLoading, setIsAppointmentsLoading] = useState<boolean>(false);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);

  const getSchedule = useCallback(async (doctorId: string) => {
    setIsScheduleLoading(true);
    setScheduleError(null);

    const targetMockSchedule: OfficeHours[] = [
      {
        id: "mock-shift-1", employeeId: doctorId, specialtyId: "mock-spec-id",
        day: DayOfTheWeek.MONDAY, startTime: "09:00:00+01:00", endTime: "13:00:00+01:00", isActive: true,
      },
      {
        id: "mock-shift-2", employeeId: doctorId, specialtyId: "mock-spec-id",
        day: DayOfTheWeek.WEDNESDAY, startTime: "08:00:00+01:00", endTime: "14:00:00+01:00", isActive: true,
      },
      {
        id: "mock-shift-3", employeeId: doctorId, specialtyId: "mock-spec-id",
        day: DayOfTheWeek.FRIDAY, startTime: "14:00:00+01:00", endTime: "18:00:00+01:00", isActive: true,
      },
    ];

    try {
      const response = await apiClient.get(`/availability/${doctorId}`);

      const body = response.data;
      const rawData = body.data;

      if (!rawData) {
        setSchedule([]);
        return;
      }

      const itemsArray = Array.isArray(rawData) ? rawData : [rawData];
      const mappedSchedule: OfficeHours[] = itemsArray.map((item: any) => ({
        id: item.id,
        employeeId: item.employeeId,
        specialtyId: item.specialtyId,
        day: englishStringToDay(item.dayOfWeek) ?? DayOfTheWeek.MONDAY,
        startTime: item.startTime,
        endTime: item.endTime,
        isActive: item.isActive,
      }));

      setSchedule(mappedSchedule);
    } catch (err: any) {
      console.error("Failed fetching doctor schedule:", err);

      if (ENV === "DEV" || import.meta.env.MODE === "development" || ENV === "development") {
        console.warn("[DEV MODE] Catch block activated. Injecting mock schedule.");
        setSchedule(targetMockSchedule);
        setScheduleError(null);
      } else {
        setScheduleError(err.message || "Ocurrió un error al obtener la disponibilidad.");
      }
    } finally {
      setIsScheduleLoading(false);
    }
  }, []);

  const getAppointments = useCallback(async (doctorId: string) => {
    setIsAppointmentsLoading(true);
    setAppointmentsError(null);

    try {
      const response = await apiClient.get(`/appointments/employee/${doctorId}`);

      const body = response.data;
      const rawData = body.data;

      if (!rawData) {
        setAppointments([]);
        return;
      }

      const itemsArray = Array.isArray(rawData) ? rawData : [rawData];
      
      const mappedAppointments: Appointment[] = itemsArray.map((item: any) => ({
        id: item.id,
        googleEventId: item.googleEventId,
        status: item.status,
        finalFeePerHour: item.finalFeePerHour,
        score: item.score,
        review: item.review,
        registeredAt: item.registeredAt,
        expectedAt: item.expectedAt, 
        employeeId: item.employeeId,
        patientId: item.patientId,
        patientCallerUserId: item.patientCallerUserId
      }));

      setAppointments(mappedAppointments);
    } catch (err: any) {
      console.error("Failed fetching doctor appointments:", err);

      if (ENV === "DEV" || import.meta.env.MODE === "development" || ENV === "development") {

      } else {
        setAppointmentsError(err.message || "Ocurrió un error al obtener las citas.");
      }
    } finally {
      setIsAppointmentsLoading(false);
    }
  }, []);

  return { 
    schedule, 
    appointments,
    isScheduleLoading, 
    isAppointmentsLoading,
    isLoading: isScheduleLoading || isAppointmentsLoading,
    
    scheduleError,
    appointmentsError,
    getSchedule,
    getAppointments
  };
}