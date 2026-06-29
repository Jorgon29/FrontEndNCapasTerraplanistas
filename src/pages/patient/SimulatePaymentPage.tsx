import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faX, faCreditCard, faLock } from "@fortawesome/free-solid-svg-icons";
import { useSimulateConfirmPayment } from "@/features/payment";

function SimulatePaymentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const simulatePayment = useSimulateConfirmPayment();

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + "/" + digits.slice(2);
    }
    return digits;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 3);
    setCvv(digits);
  };

  const luhnCheck = (cardNum: string) => {
    const digits = cardNum.replace(/\D/g, "");
    if (digits.length !== 16) return false;

    let sum = 0;
    let isEven = false;

    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits[i], 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    const cleanCardNumber = cardNumber.replace(/\s/g, "");
    if (!cleanCardNumber || cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "Ingresa un número de tarjeta válido (16 dígitos)";
    } else if (!luhnCheck(cleanCardNumber)) {
      newErrors.cardNumber = "El número de tarjeta no es válido";
    }

    if (!cardName || cardName.trim().length < 2) {
      newErrors.cardName = "Ingresa el nombre del titular";
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(expiry)) {
      newErrors.expiry = "Formato inválido (MM/YY)";
    } else {
      const [month, year] = expiry.split("/");
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const expYear = parseInt(year, 10);
      const expMonth = parseInt(month, 10);

      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiry = "La tarjeta ha expirado";
      }
    }

    if (!cvv || cvv.length !== 3) {
      newErrors.cvv = "CVV inválido (3 dígitos)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !appointmentId) {
      return;
    }

    setStatus('processing');
    setErrorMessage(null);

    try {
      await simulatePayment.mutateAsync(appointmentId);
      setStatus('success');
    } catch (err: any) {
      console.error("Payment simulation failed:", err);
      setStatus('error');
      setErrorMessage(err?.response?.data?.message || "No se pudo procesar el pago. Intenta de nuevo.");
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt text-center">
          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faCheck} className="text-3xl text-success" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">¡Pago Exitoso!</h1>
          <p className="text-text-muted mb-6">Tu cita ha sido confirmada.</p>
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

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-md w-full shadow-xl border border-surface-alt text-center">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faX} className="text-3xl text-danger" />
          </div>
          <h1 className="text-2xl font-bold text-text mb-2">Pago Fallido</h1>
          <p className="text-text-muted mb-6">{errorMessage}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-primary text-white px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors font-semibold"
            >
              Intentar de Nuevo
            </button>
            <button
              onClick={() => navigate("/patient/cart")}
              className="w-full bg-surface-alt text-text px-6 py-3 rounded-xl hover:bg-surface-alt/80 transition-colors font-semibold"
            >
              Volver al Carrito
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl p-6 md:p-8 w-full max-w-md shadow-xl border border-surface-alt">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <FontAwesomeIcon icon={faCreditCard} className="text-2xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text">Pago con Tarjeta</h1>
          <p className="text-text-muted text-sm mt-1">Ingresa los datos de tu tarjeta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Número de Tarjeta</label>
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 9012 3456"
              className={`w-full px-4 py-3 rounded-xl border ${errors.cardNumber ? 'border-danger' : 'border-surface-alt'} bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              autoComplete="cc-number"
            />
            {errors.cardNumber && <p className="text-danger text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5">Nombre del Titular</label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="Juan Pérez"
              className={`w-full px-4 py-3 rounded-xl border ${errors.cardName ? 'border-danger' : 'border-surface-alt'} bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
              autoComplete="cc-name"
            />
            {errors.cardName && <p className="text-danger text-xs mt-1">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5">Fecha de Vencimiento</label>
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                className={`w-full px-4 py-3 rounded-xl border ${errors.expiry ? 'border-danger' : 'border-surface-alt'} bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                autoComplete="cc-exp"
              />
              {errors.expiry && <p className="text-danger text-xs mt-1">{errors.expiry}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1.5">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={handleCvvChange}
                placeholder="123"
                className={`w-full px-4 py-3 rounded-xl border ${errors.cvv ? 'border-danger' : 'border-surface-alt'} bg-background text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                autoComplete="cc-csc"
              />
              {errors.cvv && <p className="text-danger text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'processing'}
            className="w-full bg-primary text-white px-6 py-3.5 rounded-xl hover:bg-primary-dark transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'processing' ? (
              <>
                <FontAwesomeIcon icon={faSpinner} spin />
                Procesando...
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faLock} className="text-sm" />
                Pagar Ahora
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-text-muted text-xs">
          <FontAwesomeIcon icon={faLock} className="text-xs" />
          <span>Pago seguro - Simulación</span>
        </div>
      </div>
    </div>
  );
}

export default SimulatePaymentPage;
