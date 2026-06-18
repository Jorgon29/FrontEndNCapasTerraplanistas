export interface Appointment {
  id: string | null;

  patient_id: string;

  patient_name: string;

  employee_id: string;

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
    id: "awdawdaaafasadsads",
    patient_id: "awdadawdad",
    patient_name: "Juan Pérez",

    employee_id: "awdadaadasdasd",
    doctor_name: "Dr. Carlos Gómez",

    expected_at: "2026-06-20T10:00:00",

    status: "SCHEDULED",

    meeting_link: "https://meet.fake/abc123",

    notes: "Consulta cardiológica",
  },

  {
    id: "awdawdad",
    patient_id: "avsfasda",
    patient_name: "Ana Martínez",

    employee_id: "dfsasdads",
    doctor_name: "Dr. Carlos Gómez",

    expected_at: "2026-06-21T15:30:00",

    status: "COMPLETED",

    meeting_link: "https://meet.fake/xyz789",

    notes: "Control médico",
  },
];