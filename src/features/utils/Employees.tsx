export interface Speciality{
    id: number;
    code: string;
    name: string;
}

export interface Doctor{
    id: number;
    first_name: string;
    last_name: string;
    professional_license_number: string;
    fee_per_hour: number;
    specialties: Speciality[];

}