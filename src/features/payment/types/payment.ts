export interface PaymentIntentResponse {
  id: string;
  status: PaymentIntentStatus;
  clientSecret: string;
  amount: number;
  currency: string;
  receiptId?: string;
}

export type PaymentIntentStatus =
  | "requires_payment_method"
  | "requires_confirmation"
  | "requires_action"
  | "processing"
  | "requires_capture"
  | "canceled"
  | "succeeded";

export interface RefundResponse {
  id: string;
  status: RefundStatus;
  amount: number;
  paymentIntentId: string;
}

export type RefundStatus = "pending" | "requires_action" | "succeeded" | "failed" | "canceled";

export interface PaymentInfo {
  currency: string;
  description: string;
}

export interface CreateTransactionRequest {
  appointmentInfo: {
    googleEventId: string;
    status: string;
    finalFeePerHour: number;
    score: null;
    review: null;
    registeredAt: string;
    expectedAt: string;
    employeeId: string;
    patientId: string;
    patientCallerUserId: string;
  };
  paymentInfo: PaymentInfo;
}

export interface TransactionResponse {
  appointment: AppointmentResponse;
  paymentIntentId: string;
  paymentStatus: string;
  clientSecret: string;
  paymentAmount: number;
}

export interface AppointmentResponse {
  id: string;
  googleEventId: string;
  status: AppointmentStatus;
  finalFeePerHour: number;
  score: number | null;
  review: string | null;
  registeredAt: string;
  expectedAt: string;
  employeeId: string;
  patientId: string;
}

export type AppointmentStatus =
  | "PENDING_PAYMENT"
  | "SCHEDULED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export interface CancellationResponse {
  appointmentId: string;
  status: string;
  refundedAmount: number;
}
