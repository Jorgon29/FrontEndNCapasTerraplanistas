import { useEffect } from "react";

function CheckoutResultPage() {
  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const sessionId = params.get('session_id');
    const redirectStatus = params.get('redirect_status');
    const appointmentId = params.get('appointment_id');

    if (sessionId) {
      sessionStorage.setItem('checkout_session_id', sessionId);
    }
    if (redirectStatus) {
      sessionStorage.setItem('checkout_redirect_status', redirectStatus);
    }

    if (appointmentId) {
      window.location.replace(`/#/patient/checkout-success/${appointmentId}`);
    } else {
      window.location.replace('/#/patient/cart');
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-text-muted">Redirigiendo...</p>
      </div>
    </div>
  );
}

export default CheckoutResultPage;