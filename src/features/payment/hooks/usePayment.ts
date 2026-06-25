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
    refetchInterval: (query) => {
      const appointment = query.state.data;
      if (appointment?.status === "PENDING_PAYMENT") {
        return 2000;
      }
      return false;
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
