import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import { useAppointment, useConfirmCheckoutSession } from "@/features/payment";

function CheckoutPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();

  const { data: appointment, isLoading, error } = useAppointment(appointmentId || null);
  const confirmCheckoutSession = useConfirmCheckoutSession();

  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed' | 'cancelled' | 'pending'>('pending');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    const redirectStatus = params.get('redirect_status');

    if (redirectStatus === 'succeeded' && sessionId) {
      setPaymentStatus('loading');
      confirmCheckoutSession.mutateAsync(sessionId)
        .then(() => {
          setPaymentStatus('success');
        })
        .catch((err) => {
          console.error("Failed to confirm payment:", err);
          setPaymentStatus('failed');
          setErrorMessage("No se pudo confirmar el pago. Contacta a soporte.");
        });
    } else if (redirectStatus === 'canceled' || redirectStatus === 'failed') {
      setPaymentStatus('cancelled');
    } else if (!sessionId) {
      setPaymentStatus('pending');
    }
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-ES", {
      style: "currency",
      currency: "USD"
    }).format(amount);
  };

  if (isLoading || paymentStatus === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary mb-4" />
          <p className="text-text-muted">Procesando pago...</p>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCheck} className="text-3xl text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">¡Pago Exitoso!</h1>
          <p className="text-text-muted mb-6">Tu cita ha sido confirmada.</p>
          <div className="bg-surface-alt rounded-xl p-4 mb-6">
            <p className="text-sm text-text-muted">Dr. {appointment?.doctor_name || "Doctor"}</p>
            {appointment?.finalFeePerHour && (
              <p className="text-lg font-bold text-primary mt-1">
                {formatCurrency(appointment.finalFeePerHour)}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/patient/calendar")}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors font-semibold"
            >
              Ir al Calendario
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="w-full bg-surface-alt text-text px-6 py-3 rounded-xl hover:bg-surface-alt/80 transition-colors font-semibold"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'cancelled' || paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt text-center">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faX} className="text-3xl text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">
            {paymentStatus === 'cancelled' ? 'Pago Cancelado' : 'Pago Fallido'}
          </h1>
          <p className="text-text-muted mb-6">
            {paymentStatus === 'cancelled'
              ? 'El pago fue cancelado. Puedes intentar de nuevo desde tu carrito.'
              : errorMessage || 'Hubo un problema con el pago. Intenta de nuevo.'}
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/patient/cart")}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors font-semibold"
            >
              Volver al Carrito
            </button>
            <button
              onClick={() => navigate("/patient")}
              className="w-full bg-surface-alt text-text px-6 py-3 rounded-xl hover:bg-surface-alt/80 transition-colors font-semibold"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt text-center">
        <h1 className="text-xl font-semibold text-text mb-4">Redirigiendo a Stripe...</h1>
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mb-4" />
        <p className="text-text-muted text-sm">
          Si no eres redirigido automáticamente, haz clic en el botón abaixo.
        </p>
        <Link
          to="/patient/cart"
          className="inline-block mt-4 text-primary hover:underline"
        >
          Volver al Carrito
        </Link>
      </div>
    </div>
  );
}

export default CheckoutPage;