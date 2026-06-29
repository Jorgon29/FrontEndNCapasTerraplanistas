import { useState } from "react";
import apiClient from "@/lib/apiClient";
import type { Doctor, Speciality } from "@/features/utils/Employees";
import { DayOfTheWeek, dayToEnglish } from "@/features/utils/DaysOfTheWeek";
import type { OfficeHours } from "@/features/utils/OfficeHours";

function useEditDoctor(doctor: Doctor) {

    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(
        doctor.specialties?.[0]?.id ?? ""
    );

    const [localSpecialties, setLocalSpecialties] = useState<Speciality[]>(doctor.specialties);
    const [newDay, setNewDay] = useState<DayOfTheWeek>(DayOfTheWeek.MONDAY);
    const [newStart, setNewStart] = useState("09:00");
    const [newEnd, setNewEnd] = useState("13:00");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const activeSpecialty = localSpecialties.find((s) => s.id === selectedSpecialtyId);

    const formatToOffset = (time: string) => `${time}:00+01:00`;
    const formatToHTML = (offsetStr: string) => offsetStr.substring(0, 5);

    const handleCreate = async () => {
        if (!selectedSpecialtyId) return;
        setIsSubmitting(true);

        const payload = {
            employeeId: doctor.id,
            specialtyId: selectedSpecialtyId,
            dayOfWeek: dayToEnglish(newDay),
            startTime: formatToOffset(newStart),
            endTime: formatToOffset(newEnd),
        };

        try {
            const response = await apiClient.post("/availability", payload);

            if (response.status !== 200 && response.status !== 201) throw new Error("Error creating availability");

            const createdRecord = response.data.data;

            setLocalSpecialties((prev) =>
                prev.map((spec) => {
                    if (spec.id === selectedSpecialtyId) {
                        return {
                            ...spec,
                            officeHours: [
                                ...spec.officeHours,
                                {
                                    id: createdRecord.id,
                                    day: newDay,
                                    startTime: formatToOffset(newStart),
                                    endTime: formatToOffset(newEnd),
                                },
                            ],
                        };
                    }
                    return spec;
                })
            );

            setNewStart("09:00");
            setNewEnd("13:00");
        } catch (error) {
            console.error(error);
            alert("Hubo un error al guardar el horario.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (availabilityId: string) => {
        try {
            const response = await apiClient.delete(`/availability/${availabilityId}`);

            if (response.status !== 200 && response.status !== 204) throw new Error("Error deleting availability");

            setLocalSpecialties((prev) =>
                prev.map((spec) => {
                    if (spec.id === selectedSpecialtyId) {
                        return {
                            ...spec,
                            officeHours: spec.officeHours.filter((h: OfficeHours) => h.id !== availabilityId)
                        };
                    }
                    return spec;
                })
            );
        } catch (error) {
            console.error(error);
            alert("Hubo un error al eliminar el horario.");
        }
    };

    return {
        selectedSpecialtyId,
        setSelectedSpecialtyId,
        localSpecialties,
        newDay,
        setNewDay,
        newStart,
        setNewStart,
        newEnd,
        setNewEnd,
        isSubmitting,

        activeSpecialty,
        formatToHTML,

        handleCreate,
        handleDelete,
    };
}

export default useEditDoctor;