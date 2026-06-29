import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "@/config/config";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      variables: {
        colorPrimary: "#0d9488",
        colorBackground: "#1e293b",
        colorText: "#f8fafc",
        colorDanger: "#ef4444",
        fontFamily: "system-ui, sans-serif",
        borderRadius: "12px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}

export { stripePromise };
