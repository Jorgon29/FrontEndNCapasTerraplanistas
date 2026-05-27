export interface Appointment {
  id: number;

  patient_id: number;

  patient_name: string;

  employee_id: number;

  doctor_name: string;

  expected_at: string;

  status:
    | "SCHEDULED"
    | "COMPLETED"
    | "CANCELLED";

  meeting_link: string;

  notes?: string;

  score?: number;

  review?: string;
}


export const appointments: Appointment[] = [
  {
    id: 1,
    patient_id: 1,
    patient_name: "Juan Pérez",

    employee_id: 1,
    doctor_name: "Dr. Carlos Gómez",

    expected_at: "2026-06-20T10:00:00",

    status: "SCHEDULED",

    meeting_link: "https://meet.fake/abc123",

    notes: "Consulta cardiológica",
  },

  {
    id: 2,
    patient_id: 2,
    patient_name: "Ana Martínez",

    employee_id: 1,
    doctor_name: "Dr. Carlos Gómez",

    expected_at: "2026-06-21T15:30:00",

    status: "COMPLETED",

    meeting_link: "https://meet.fake/xyz789",

    notes: "Control médico",
  },
];