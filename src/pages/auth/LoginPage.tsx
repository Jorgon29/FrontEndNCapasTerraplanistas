import GoogleSignInButton from "@/components/GoogleSignInButton";
import { Link } from "react-router";

function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-md text-center border border-primary-light/20">
        <h2 className="text-2xl font-bold text-text mb-4">Iniciar Sesión</h2>
        <p className="mb-4 text-text/70">Inicia sesión con tu cuenta de Google para acceder a la clínica.</p>
        <GoogleSignInButton rememberMe={true} />
      </div>

      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-md text-center border border-primary-light/20">
        <h4 className="mb-3 text-text font-medium">¿No tienes cuenta?</h4>
        <p className="text-text/70 text-sm mb-3">
          Regístrate usando tu cuenta de Google. Si eres paciente nuevo, se creará una cuenta automáticamente.
        </p>
        <Link
          to={"/auth/register"}
          className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-background 
            transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
            focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text cursor-pointer"
        >
          Regístrate
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
