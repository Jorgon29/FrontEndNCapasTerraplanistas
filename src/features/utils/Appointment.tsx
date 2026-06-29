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