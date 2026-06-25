import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import {
  useAppointment,
  useDeleteAppointment,
  StripeProvider,
  PaymentForm,
  PaymentSuccess,
} from "@/features/payment";
import { apiClient } from "@/lib/apiClient";

function CheckoutPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const { data: appointment, isLoading, error } = useAppointment(appointmentId || null);
  const deleteAppointment = useDeleteAppointment();

  const [paymentComplete, setPaymentComplete] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [fetchingPayment, setFetchingPayment] = useState(false);

  useEffect(() => {
    if (appointment?.status === "PENDING_PAYMENT" && appointmentId && !clientSecret) {
      setFetchingPayment(true);
      apiClient
        .post(
          "/appointments/transactions",
          {
            appointmentInfo: {
              googleEventId: "",
              status: "PENDING_PAYMENT",
              finalFeePerHour: appointment.finalFeePerHour,
              score: null,
              review: null,
              registeredAt: new Date().toISOString(),
              expectedAt: appointment.expectedAt,
              employeeId: appointment.employeeId,
              patientId: appointment.patientId,
              patientCallerUserId: appointment.patientCallerUserId,
            },
            paymentInfo: {
              currency: "usd",
              description: "Payment for appointment",
            },
          },
          {
            params: { existingAppointment: appointmentId },
          }
        )
        .then((res) => {
          setClientSecret(res.data.clientSecret);
          setPaymentAmount(res.data.paymentAmount);
          setCurrency(res.data.paymentStatus?.toUpperCase() || "USD");
        })
        .catch((err) => {
          console.error("Failed to create payment intent:", err);
        })
        .finally(() => {
          setFetchingPayment(false);
        });
    }
  }, [appointment, appointmentId, clientSecret]);

  const handlePaymentSuccess = () => {
    setPaymentComplete(true);
  };

  const handlePaymentCancel = async () => {
    if (appointmentId) {
      try {
        await deleteAppointment.mutateAsync(appointmentId);
      } catch (err) {
        console.error("Failed to delete appointment:", err);
      }
    }
    navigate(-1);
  };

  const handleBack = () => {
    if (!paymentComplete && appointmentId) {
      handlePaymentCancel();
    }
    navigate(-1);
  };

  if (isLoading || fetchingPayment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">No se encontró la cita</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt">
          <PaymentSuccess
            appointmentId={appointment.id!}
            amount={paymentAmount}
            currency={currency}
            onContinue={() => navigate("/patient/calendar")}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-lg shadow-xl border border-surface-alt overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-alt">
          <button
            onClick={handleBack}
            className="text-text-muted hover:text-text transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-text">Pago de cita</h1>
            <p className="text-xs text-text-muted">
              Dr. {appointment.doctor_name || "Doctor"}
            </p>
          </div>
        </div>

        <div className="p-6">
          {clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <PaymentForm
                onSuccess={handlePaymentSuccess}
                onCancel={handlePaymentCancel}
                amount={paymentAmount}
                currency={currency}
              />
            </StripeProvider>
          ) : (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mb-4" />
              <p className="text-text-muted">Preparando pago...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
