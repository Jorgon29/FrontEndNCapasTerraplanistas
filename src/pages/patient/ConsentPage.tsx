import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import apiClient from "@/lib/apiClient";
import { authStorage } from "@/lib/authStorage";

interface InitRegistrationResponse {
  pendingUserConfigId: string | null;
  isAdult: boolean;
  message: string;
}

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDiff = today.getMonth() - birthdate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
    age--;
  }
  return age;
}

export default function ConsentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const googleUserId = searchParams.get("googleUserId") || "";
  const email = searchParams.get("email") || "";
  const name = searchParams.get("name") || "";

  const [step, setStep] = useState<"birthdate" | "consent" | "processing">("birthdate");
  const [birthdate, setBirthdate] = useState<string>("");
  const [isMinor, setIsMinor] = useState<boolean>(false);
  const [pendingUserConfigId, setPendingUserConfigId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [treatmentPurpose, setTreatmentPurpose] = useState(false);
  const [dataAnalysis, setDataAnalysis] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleVerifyAge = async () => {
    if (!birthdate) return;

    const birthDateObj = new Date(birthdate);
    const age = calculateAge(birthDateObj);

    if (age < 18) {
      setIsMinor(true);
      return;
    }

    setStep("processing");
    setError(null);

    try {
      const response = await apiClient.post<InitRegistrationResponse>("/auth/init-registration", {
        googleUserId,
        email,
        name,
        birthdate: birthdate
      });

      setPendingUserConfigId(response.data.pendingUserConfigId);
      setStep("consent");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al verificar la edad. Intente de nuevo.");
      setStep("birthdate");
    }
  };

  const handleSubmitConsent = async () => {
    if (!treatmentPurpose || !dataAnalysis) return;

    const accessToken = authStorage.getAccessToken();
    if (!accessToken) {
      setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await apiClient.post("/auth/submit-consent", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      navigate("/patient/profile");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al completar el registro. Intente de nuevo.");
      setSubmitting(false);
    }
  };

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-lg shadow-xl border border-surface-alt overflow-hidden">
        <div className="p-6 border-b border-surface-alt">
          <h1 className="text-xl font-bold text-text">Registro de Usuario</h1>
          <p className="text-sm text-text-muted mt-1">Debes aceptar los términos para continuar</p>
        </div>

        <div className="p-6">
          {step === "birthdate" && !isMinor && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => {
                    setBirthdate(e.target.value);
                    setError(null);
                    setIsMinor(false);
                  }}
                  max={maxDate.toISOString().split("T")[0]}
                  min={minDate.toISOString().split("T")[0]}
                  className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleVerifyAge}
                disabled={!birthdate}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
              >
                Verificar edad
              </button>
            </div>
          )}

          {isMinor && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-400 mb-3" />
              <p className="text-base text-red-400 font-semibold mb-2">
                Debes tener al menos 18 años para registrarte
              </p>
              <p className="text-sm text-text-muted">
                Un adulto debe completar este proceso por ti.
              </p>
            </div>
          )}

          {step === "processing" && (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mb-4" />
              <p className="text-text-muted">Verificando...</p>
            </div>
          )}

          {step === "consent" && (
            <div className="space-y-4">
              <div className="bg-surface-alt/50 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-text">Términos y Condiciones</h3>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={treatmentPurpose}
                    onChange={(e) => setTreatmentPurpose(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-surface-alt text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-muted">
                    Acepto que mis datos sean utilizados para fines de tratamiento médico y gestión de citas de la clínica.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dataAnalysis}
                    onChange={(e) => setDataAnalysis(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-surface-alt text-primary focus:ring-primary cursor-pointer"
                  />
                  <span className="text-sm text-text-muted">
                    Acepto que mis datos sean utilizados de manera anonimizada para análisis estadísticos y mejora de servicios de la clínica.
                  </span>
                </label>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleSubmitConsent}
                disabled={!treatmentPurpose || !dataAnalysis || submitting}
                className="w-full bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {submitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Procesando...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faCheck} />
                    Aceptar y continuar
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
