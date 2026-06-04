import FormCard from "@/features/auth/components/FormCard";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import { Link } from "react-router";

function LoginPage() {
  return (
    <FormCard>
            <h4>¿No tienes cuenta?</h4>
            <div className="m-4"></div>
            <Link to={"/auth/register"} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background 
        transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text cursor-pointer">Regístrate</Link>
            <div className="m-4"></div>
    <FormCard>
      <h2>Iniciar Sesión</h2>
      <FormField id="email" label="Email" type="email"
        placeholder="tu@email.com" autoComplete="email" required />
      <FormField id="password" label="Contraseña" type="password"
        placeholder="••••••••" autoComplete="current-password" required />
      <SubmitButton label="Iniciar sesión"/>
    </FormCard>
    </FormCard>
  );
}

export default LoginPage;