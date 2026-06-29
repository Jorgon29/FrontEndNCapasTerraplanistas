export enum DayOfTheWeek {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY,
    MISSIGNO
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

export function dayToEnglish(day: DayOfTheWeek): string {
    switch (day) {
        case DayOfTheWeek.MONDAY: return "MONDAY";
        case DayOfTheWeek.TUESDAY: return "TUESDAY";
        case DayOfTheWeek.WEDNESDAY: return "WEDNESDAY";
        case DayOfTheWeek.THURSDAY: return "THURSDAY";
        case DayOfTheWeek.FRIDAY: return "FRIDAY";
        case DayOfTheWeek.SATURDAY: return "SATURDAY";
        case DayOfTheWeek.SUNDAY: return "SUNDAY";
        default: return "UNKNOWN";
    }
}

export function englishStringToDay(dayStr: string): DayOfTheWeek{
    const normalized = dayStr.trim().toUpperCase();

    switch (normalized) {
        case "MONDAY": return DayOfTheWeek.MONDAY;
        case "TUESDAY": return DayOfTheWeek.TUESDAY;
        case "WEDNESDAY": return DayOfTheWeek.WEDNESDAY;
        case "THURSDAY": return DayOfTheWeek.THURSDAY;
        case "FRIDAY": return DayOfTheWeek.FRIDAY;
        case "SATURDAY": return DayOfTheWeek.SATURDAY;
        case "SUNDAY": return DayOfTheWeek.SUNDAY;
        default: return DayOfTheWeek.MISSIGNO;
    }
}
