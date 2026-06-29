import { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faX } from "@fortawesome/free-solid-svg-icons";

interface PaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  amount: number;
  currency: string;
}

export function PaymentForm({
  onSuccess,
  onCancel,
  amount,
  currency,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (elements && !isReady) {
      setIsReady(true);
    }
  }, [elements, isReady]);

  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !isReady) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: window.location.href,
      },
    });

    if (error) {
      setErrorMessage(error.message || "Payment failed. Please try again.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess();
    } else {
      setErrorMessage("Payment was not completed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (!isReady) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center py-8">
        <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary" />
        <p className="text-text-muted text-sm">Cargando método de pago...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="bg-surface/50 rounded-xl p-4 border border-surface-alt">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-text-muted">Total a pagar</span>
          <span className="text-xl font-bold text-text">{formattedAmount}</span>
        </div>
        <PaymentElement
          options={{
            layout: "tabs",
          }}
        />
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 flex items-center gap-2 text-red-400 text-sm">
          <FontAwesomeIcon icon={faX} className="text-xs" />
          {errorMessage}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 bg-surface-alt text-text rounded-xl py-3 text-sm font-semibold hover:bg-surface-alt/80 transition-colors cursor-pointer disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={!stripe || !isReady || isProcessing}
          className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <FontAwesomeIcon icon={faSpinner} spin />
              Procesando...
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faCheck} />
              Pagar {formattedAmount}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
