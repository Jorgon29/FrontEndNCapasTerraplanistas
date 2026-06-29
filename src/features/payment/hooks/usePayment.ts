import { useMutation, useQuery } from "react-query";
import apiClient from "@/lib/apiClient";
import type {
  CreateTransactionRequest,
  TransactionResponse,
  AppointmentResponse,
  CancellationResponse,
} from "../types/payment";

export function useCreateTransaction() {
  return useMutation({
    mutationFn: async (
      data: CreateTransactionRequest
    ): Promise<TransactionResponse> => {
      const response = await apiClient.post<TransactionResponse>(
        "/appointments/transactions",
        data
      );
      return response.data;
    },
  });
}

export function useAppointment(appointmentId: string | null) {
  return useQuery({
    queryKey: ["appointment", appointmentId],
    queryFn: async (): Promise<AppointmentResponse> => {
      const response = await apiClient.get<AppointmentResponse>(
        `/appointments/${appointmentId}`
      );
      return response.data;
    },
    enabled: !!appointmentId,
    refetchInterval: 2000,
  });
}

export function usePendingAppointments() {
  return useQuery({
    queryKey: ["appointments", "pending"],
    queryFn: async (): Promise<AppointmentResponse[]> => {
      const response = await apiClient.get("/appointments/my-appointments");
      let appointments: AppointmentResponse[] = [];
      if (response.data?.content) {
        appointments = response.data.content;
      } else if (Array.isArray(response.data)) {
        appointments = response.data;
      }
      return appointments.filter(apt => apt.status === "PENDING_PAYMENT");
    },
  });
}

export function useCancelAppointment() {
  return useMutation({
    mutationFn: async (
      appointmentId: string
    ): Promise<CancellationResponse> => {
      const response = await apiClient.post<CancellationResponse>(
        `/appointments/${appointmentId}/cancel`
      );
      return response.data;
    },
  });
}

export function useDeleteAppointment() {
  return useMutation({
    mutationFn: async (appointmentId: string): Promise<void> => {
      await apiClient.delete(`/appointments/${appointmentId}`);
    },
  });
}

export function useConfirmPayment() {
  return useMutation({
    mutationFn: async ({
      appointmentId,
      paymentIntentId,
    }: {
      appointmentId: string;
      paymentIntentId: string;
    }): Promise<AppointmentResponse> => {
      const response = await apiClient.post<AppointmentResponse>(
        `/appointments/${appointmentId}/confirm-payment`,
        { paymentIntentId }
      );
      return response.data;
    },
  });
}

export function useConfirmCheckoutSession() {
  return useMutation({
    mutationFn: async (sessionId: string): Promise<AppointmentResponse> => {
      const response = await apiClient.post<AppointmentResponse>(
        `/appointments/checkout-session/${sessionId}/confirm`
      );
      return response.data;
    },
  });
}

export function useSimulateConfirmPayment() {
  return useMutation({
    mutationFn: async (appointmentId: string): Promise<AppointmentResponse> => {
      const response = await apiClient.post<AppointmentResponse>(
        `/appointments/${appointmentId}/confirm-simulate`
      );
      return response.data;
    },
  });
}
