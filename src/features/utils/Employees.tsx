import type { OfficeHours } from "./OfficeHours";

export interface Speciality{
    code?: string,
    id: string;
    licence: string;
    name: string;
    feePerHour: number,
    duration: number,
    officeHours: OfficeHours[]
}

export interface Doctor{
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    professional_license_number: string;
    is_active: boolean,
    specialties: Speciality[],
    email: string,
    idType: "DNI" | "PASSPORT"
}

export interface Employee{
    id: number;
    first_name: string;
    last_name: string;
}