import FormCard from "@/features/auth/components/FormCard";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";

function LoginPage() {
  return (
    <FormCard>
      <FormField id="email" label="Email" type="email"
        placeholder="tu@email.com" autoComplete="email" required />
      <FormField id="password" label="Contraseña" type="password"
        placeholder="••••••••" autoComplete="current-password" required />
      <SubmitButton label="Iniciar sesión" />
    </FormCard>
  );
}

export default LoginPage;