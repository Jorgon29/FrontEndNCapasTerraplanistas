export interface Speciality{
    id: string;
    licence: string;
    name: string;
    feePerHour: number
}

export interface Doctor{
    id: string;
    employee_id: string;
    first_name: string;
    last_name: string;
    professional_license_number: string;
    is_active: boolean,
    specialties: Speciality[]
}

export interface Employee{
    id: number;
    first_name: string;
    last_name: string;
}