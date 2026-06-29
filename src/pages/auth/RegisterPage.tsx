import BASE_URL from "@/config/config";
import FormCard from "@/features/auth/components/FormCard";
import FormDatePicker from "@/features/auth/components/FormDatePicker";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import RepresentativeModal from "@/features/auth/components/RepresentativeModal";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

/*

const originalFetch = window.fetch;
window.fetch = async (url, options) => {
  if (url.toString().includes("/auth/register")) {
    return new Response(JSON.stringify({ data: { id: "mock-patient-id-123" } }), { status: 200 });
  }
  return originalFetch(url, options);
};

*/
const MINOR_AGE_THRESHOLD = 18;

function calculateAge(birthdate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthdate.getFullYear();
  const hasHadBirthdayThisYear =
    today.getMonth() > birthdate.getMonth() ||
    (today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());
  if (!hasHadBirthdayThisYear) age -= 1;
  return age;
}

function RegisterPage() {
  const [birthdate, setBirthdate] = useState<Date>(new Date(1999, 11));
  const navigate = useNavigate();

  const [pendingPatientId, setPendingPatientId] = useState<string | null>(null);
  const [showRepresentativeModal, setShowRepresentativeModal] = useState(false);

  const handleRegisterSuccess = (responseData: any) => {
    const isMinor = calculateAge(birthdate) < MINOR_AGE_THRESHOLD;

    if (isMinor) {
      setPendingPatientId(responseData.data.id);
      setShowRepresentativeModal(true);
    } else {
      navigate("/auth/login");
    }
  };

  const handleRepresentativeSuccess = () => {
    setShowRepresentativeModal(false);
    navigate("/auth/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-md text-center">
        <h4 className="mb-3 text-text">¿Ya tienes cuenta?</h4>
        <Link
          to={"/auth/login"}
          className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-background hover:bg-primary-dark"
        >
          Inicia sesión
        </Link>
      </div>

      <FormCard
        actionPath={`${BASE_URL}/auth/register`}
        onSuccess={handleRegisterSuccess}
      >
        <h2 className="text-2xl font-bold text-text">Registrar</h2>

        <FormField id="email" label="Email" type="email" required placeholder="tu@email.com" autoComplete="email" />

        <div className="flex flex-row flex-wrap gap-4">
          <FormField id="firstname" label="1er nombre" required className="flex-1" />
          <FormField id="secondname" label="2do nombre" className="flex-1" />
          <FormField id="firstsurname" label="1er apellido" required className="flex-1" />
          <FormField id="secondsurname" label="2do apellido" className="flex-1" />
        </div>

        <FormField id="dui" label="DUI" required placeholder="00000000-0" />

        <FormDatePicker
          selected={birthdate}
          setSelected={setBirthdate}
          defaultDate={new Date(1999, 11)}
          label="Fecha de nacimiento"
        />

        <FormField id="password1" label="Contraseña" required type="password" />
        <FormField id="password2" label="Repite contraseña" required type="password" />

        <SubmitButton label="Registrar" />
      </FormCard>

      {showRepresentativeModal && pendingPatientId && (
        <RepresentativeModal
          patientId={pendingPatientId}
          onClose={() => setShowRepresentativeModal(false)}
          onSuccess={handleRepresentativeSuccess}
        />
      )}
    </div>
  );
}

export default RegisterPage;