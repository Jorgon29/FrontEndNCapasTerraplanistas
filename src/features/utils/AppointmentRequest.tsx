export interface AppointmentRequest {
    googleEventId: string;
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