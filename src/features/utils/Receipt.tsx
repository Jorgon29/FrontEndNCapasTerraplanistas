export interface Receipt {
  id: number;

  appointment_id: number;

  amount: number;

  payment_status:
    | "PENDING"
    | "PAID"
    | "CANCELLED";

  transaction_id: string;

  billing_details: string;

  created_at: string;

  updated_at: string;
}