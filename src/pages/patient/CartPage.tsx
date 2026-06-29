import { useNavigate } from "react-router";
import { usePendingAppointments, useDeleteAppointment } from "@/features/payment";
import { Loader2, Calendar, Clock, Trash2, CreditCard, ShoppingCart, AlertCircle } from "lucide-react";
import apiClient from "@/lib/apiClient";

export default function CartPage() {
  const navigate = useNavigate();
  const { data: pendingAppointments, isLoading, error, refetch } = usePendingAppointments();
  const deleteAppointment = useDeleteAppointment();

  const handlePayNow = async (appointmentId: string) => {
    try {
      const baseUrl = window.location.origin.replace(/\/$/, '');
      const successUrl = `${baseUrl}/checkout-callback.html?appointment_id=${appointmentId}`;
      const cancelUrl = `${baseUrl}/#/patient/cart`;
      const response = await apiClient.get(`/appointments/${appointmentId}/checkout-session`, {
        params: { successUrl, cancelUrl }
      });
      if (response.data.checkoutUrl) {
        if (response.data.checkoutUrl.includes("/patient/simulate-payment/")) {
          navigate(response.data.checkoutUrl);
        } else {
          window.location.href = response.data.checkoutUrl;
        }
      }
    } catch (err) {
      console.error("Failed to create checkout session:", err);
      alert("No se pudo iniciar el pago. Intenta de nuevo.");
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        await deleteAppointment.mutateAsync(appointmentId);
        refetch();
      } catch (err) {
        console.error("Failed to delete appointment:", err);
        alert("No se pudo cancelar la cita. Intenta de nuevo.");
      }
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  const totalAmount = pendingAppointments?.reduce((sum, apt) => sum + apt.finalFeePerHour, 0) || 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl border border-surface-alt p-6 max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-danger mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-text mb-2">Error al cargar</h2>
          <p className="text-text-muted mb-4">No se pudieron cargar las citas pendientes.</p>
          <button
            onClick={() => refetch()}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-warning/10">
            <ShoppingCart className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text">Carrito de Compras</h1>
            <p className="text-text-muted text-sm">Citas pendientes de pago</p>
          </div>
        </div>

        {pendingAppointments?.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-surface-alt p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-text-muted mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-text mb-2">Tu carrito está vacío</h2>
            <p className="text-text-muted mb-6">No tienes citas pendientes de pago.</p>
            <button
              onClick={() => navigate("/patient/search")}
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors"
            >
              Buscar un doctor
            </button>
          </div>
        ) : (
          <>
            <div className="bg-surface rounded-2xl border border-surface-alt divide-y divide-surface-alt">
              {pendingAppointments?.map((appointment) => (
                <div key={appointment.id} className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="hidden sm:flex p-3 rounded-full bg-primary/10">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-text">
                          {appointment.doctor_name || "Dr. Por asignar"}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-text-muted mt-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(appointment.expectedAt)}</span>
                          <span>•</span>
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(appointment.expectedAt)}</span>
                        </div>
                        <p className="text-lg font-bold text-primary mt-2">
                          {formatCurrency(appointment.finalFeePerHour)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                      <button
                        onClick={() => handlePayNow(appointment.id)}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
                      >
                        <CreditCard className="h-4 w-4" />
                        Pagar Ahora
                      </button>
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="p-2.5 text-danger hover:bg-danger/10 rounded-xl transition-colors"
                        title="Cancelar cita"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-surface rounded-2xl border border-surface-alt p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-muted text-sm">Total a pagar</p>
                  <p className="text-2xl font-bold text-text">{formatCurrency(totalAmount)}</p>
                </div>
                <p className="text-text-muted text-sm">
                  {pendingAppointments?.length} cita{pendingAppointments?.length !== 1 ? "s" : ""} pendiente{pendingAppointments?.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
