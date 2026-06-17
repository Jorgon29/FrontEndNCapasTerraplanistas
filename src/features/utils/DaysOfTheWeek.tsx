
export enum DayOfTheWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY
}

export function dayToSpanish(day: DayOfTheWeek): string {
    switch (day) {
        case DayOfTheWeek.MONDAY: return "Lunes";
        case DayOfTheWeek.TUESDAY: return "Martes";
        case DayOfTheWeek.WEDNESDAY: return "Miércoles";
        case DayOfTheWeek.THURSDAY: return "Jueves";
        case DayOfTheWeek.FRIDAY: return "Viernes";
        case DayOfTheWeek.SATURDAY: return "Sábado";
        case DayOfTheWeek.SUNDAY: return "Domingo";
        default: return "Día Desconocido";
    }
}

export function englishStringToDay(dayStr: string): DayOfTheWeek | undefined {
    const normalized = dayStr.trim().toUpperCase();

    switch (normalized) {
        case "MONDAY": return DayOfTheWeek.MONDAY;
        case "TUESDAY": return DayOfTheWeek.TUESDAY;
        case "WEDNESDAY": return DayOfTheWeek.WEDNESDAY;
        case "THURSDAY": return DayOfTheWeek.THURSDAY;
        case "FRIDAY": return DayOfTheWeek.FRIDAY;
        case "SATURDAY": return DayOfTheWeek.SATURDAY;
        case "SUNDAY": return DayOfTheWeek.SUNDAY;
        default: return undefined;
    }
}
