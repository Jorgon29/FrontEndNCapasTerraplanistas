import { useState, useEffect } from "react";
import BASE_URL from "@/config/config";
import { format, eachDayOfInterval } from "date-fns";

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

function generateMockSlots(
    doctorId: string,
    specialtyCode: string,
    startDate: Date,
    endDate: Date,
    durationMinutes: number
): AvailableSlotResponse[] {
    const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });
    const mockSlots: AvailableSlotResponse[] = [];

    daysInRange.forEach((day) => {
        if (day.getDay() === 0) return;

        const dateStr = format(day, "yyyy-MM-dd");

        mockSlots.push({
            doctorId,
            doctorFirstName: "Mock",
            doctorLastName: "Doctor",
            specialtyCode,
            specialtyName: "Especialidad Mock",
            date: dateStr,
            startTime: "09:00:00Z",
            endTime: "10:00:00Z",
            feePerHour: 150.00,
            consultDurationMinutes: durationMinutes
        });

        mockSlots.push({
            doctorId,
            doctorFirstName: "Mock",
            doctorLastName: "Doctor",
            specialtyCode,
            specialtyName: "Especialidad Mock",
            date: dateStr,
            startTime: "14:00:00Z",
            endTime: "15:00:00Z", 
            feePerHour: 150.00,
            consultDurationMinutes: durationMinutes
        });
    });

    return mockSlots;
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
    const isDevMode = import.meta.env.DEV; 

    useEffect(() => {
        if (!doctorId || !specialtyCode || !consultDurationMinutes) return;

        const fetchSlots = async () => {
            setIsLoading(true);

            if (isDevMode) {
                console.warn("Dev Injecting mock available slots.");
                setTimeout(() => {
                    const mockData = generateMockSlots(
                        doctorId, 
                        specialtyCode, 
                        startDate, 
                        endDate, 
                        consultDurationMinutes
                    );
                    setSlots(mockData);
                    setIsLoading(false);
                }, 800);
                return;
            }
            // -------------------------------

            try {
                const params = new URLSearchParams({
                    doctorId: doctorId,
                    specialtyCode: specialtyCode,
                    startDate: format(startDate, "yyyy-MM-dd"),
                    endDate: format(endDate, "yyyy-MM-dd"),
                    consultDurationMinutes: consultDurationMinutes.toString(),
                });

                const res = await fetch(`${BASE_URL}/slots/available?${params.toString()}`);
                if (!res.ok) throw new Error("Error fetching available slots");
                
                const json = await res.json();
                setSlots(json.data || []);
            } catch (error) {
                console.error("Failed to load slots:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSlots();
    }, [doctorId, specialtyCode, startDate, endDate, consultDurationMinutes, isDevMode]);

    return { slots, isLoading };
}