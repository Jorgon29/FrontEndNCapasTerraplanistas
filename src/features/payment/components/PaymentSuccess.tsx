import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";

interface PaymentSuccessProps {
  appointmentId: string;
  amount: number;
  currency: string;
  onContinue: () => void;
}

export function PaymentSuccess({
  amount,
  currency,
  onContinue,
}: PaymentSuccessProps) {
  const formattedAmount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center">
      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
        <FontAwesomeIcon
          icon={faCheckCircle}
          className="text-3xl text-green-400"
        />
      </div>
      <div>
        <h3 className="text-xl font-bold text-text mb-1">¡Pago exitoso!</h3>
        <p className="text-text-muted text-sm">
          Tu cita ha sido reservada exitosamente
        </p>
      </div>
      <div className="bg-surface/50 rounded-xl p-4 border border-surface-alt w-full">
        <div className="flex justify-between items-center">
          <span className="text-sm text-text-muted">Monto pagado</span>
          <span className="text-lg font-bold text-green-400">
            {formattedAmount}
          </span>
        </div>
      </div>
      <button
        onClick={onContinue}
        className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
      >
        Continuar
      </button>
    </div>
  );
}
