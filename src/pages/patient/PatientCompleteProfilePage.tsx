import { useState } from "react";
import { useNavigate } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faCheck, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { authStorage } from "@/lib/authStorage";
import apiClient from "@/lib/apiClient";

interface CompleteProfileResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  is_new_user: boolean;
  account_status: string;
  requires_action: string;
  user: {
    id: string;
    google_user_id: string;
    name: string;
    email: string;
    roles: string[];
    account_status: string;
    requires_action: string;
  };
}

export default function PatientCompleteProfilePage() {
  const navigate = useNavigate();

  const user = authStorage.getUser();
  const pendingUserConfigId = user?.pendingUserConfigId;

  const [step, setStep] = useState<"form" | "submitting" | "error">("form");
  const [error, setError] = useState<string | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idType, setIdType] = useState<"DNI" | "PASAPORTE" | "OTRO">("DNI");
  const [idNumber, setIdNumber] = useState("");
  const [address, setAddress] = useState("");
  const [phones, setPhones] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!firstName || !lastName || !idNumber || !address) {
      setError("Todos los campos son requeridos");
      return;
    }

    if (!pendingUserConfigId) {
      setError("No se encontró información de registro pendiente. Por favor inicia sesión nuevamente.");
      return;
    }

    const accessToken = authStorage.getAccessToken();
    if (!accessToken) {
      setError("Sesión expirada. Por favor inicia sesión nuevamente.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setStep("submitting");

    try {
      const response = await apiClient.post("/patient/complete-profile", {
        firstName,
        lastName,
        idType,
        idNumber,
        address,
        phones
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      const data = typeof response.data.message === 'string'
        ? JSON.parse(response.data.message)
        : response.data.message;

      authStorage.setTokens(data.access_token, data.refresh_token, data.user);

      navigate("/search");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al completar el registro. Intente de nuevo.");
      setStep("error");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-surface rounded-2xl w-full max-w-lg shadow-xl border border-surface-alt overflow-hidden">
        <div className="p-6 border-b border-surface-alt">
          <h1 className="text-xl font-bold text-text">Completar Perfil</h1>
          <p className="text-sm text-text-muted mt-1">Ingresa tu información personal para finalizar el registro</p>
        </div>

        <div className="p-6">
          {step === "submitting" && (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faSpinner} spin className="text-3xl text-primary mb-4" />
              <p className="text-text-muted">Completando registro...</p>
            </div>
          )}

          {(step === "form" || step === "error") && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-sm text-red-400">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Nombres *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                    placeholder="Tu nombre"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Apellidos *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Tipo de documento *
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value as "DNI" | "PASAPORTE" | "OTRO")}
                  className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                >
                  <option value="DNI">DNI</option>
                  <option value="PASAPORTE">Pasaporte</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Número de documento *
                </label>
                <input
                  type="text"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                  className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                  placeholder="123456789"
                  pattern="\d{9}"
                  title="El DUI debe tener 9 dígitos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Dirección *
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                  placeholder="Tu dirección completa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phones}
                  onChange={(e) => setPhones(e.target.value)}
                  className="w-full bg-background border border-surface-alt rounded-xl p-3 text-text focus:outline-none focus:border-primary"
                  placeholder="+503 1234 5678"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !firstName || !lastName || !idNumber || !address}
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
                    Completar Registro
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
