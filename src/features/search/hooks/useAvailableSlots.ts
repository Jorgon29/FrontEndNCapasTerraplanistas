import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";
import { format } from "date-fns";

export interface AvailableSlotResponse {
    doctorId: string;
    doctorFirstName: string;
    doctorLastName: string;
    specialtyCode: string;
    specialtyName: string;
    date: string;
    startTime: string;
    endTime: string;
    feePerHour: number;
    consultDurationMinutes: number;
}

export function useAvailableSlots(
    doctorId: string | undefined,
    specialtyCode: string | undefined,
    startDate: Date,
    endDate: Date,
    consultDurationMinutes: number | undefined
) {
    const [slots, setSlots] = useState<AvailableSlotResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!doctorId || !specialtyCode || !consultDurationMinutes) return;

        const fetchSlots = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams({
                    doctorId: doctorId,
                    specialtyCode: specialtyCode,
                    startDate: format(startDate, "yyyy-MM-dd"),
                    endDate: format(endDate, "yyyy-MM-dd"),
                    consultDurationMinutes: consultDurationMinutes.toString(),
                });

                const res = await apiClient.get(`/slots/available?${params.toString()}`);
                setSlots(res.data.data || []);
            } catch (error: any) {
                console.error("Failed to load slots:", error);
                setError(error.response?.data?.message || "Failed to load available slots");
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();
    }, [doctorId, specialtyCode, startDate, endDate, consultDurationMinutes]);

    return { slots, isLoading, error };
}