import FormCard from "@/features/auth/components/FormCard";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import { Link, useNavigate } from "react-router";

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = (data: any) => {
    console.log("¡Inicio de sesión exitoso!", data);
    
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    
    navigate("/search"); 
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-6">
      
      <div className="w-full max-w-md rounded-2xl bg-background p-6 shadow-md text-center border border-primary-light/20">
        <h4 className="mb-3 text-text font-medium">¿No tienes cuenta?</h4>
        <Link 
          to={"/auth/register"} 
          className="block w-full rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-background 
            transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
            focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text cursor-pointer"
        >
          Regístrate
        </Link>
      </div>

      <FormCard 
        actionPath="/api/auth/login" 
        onSuccess={handleLoginSuccess}
      >
        <h2 className="text-2xl font-bold text-text">Iniciar Sesión</h2>
        
        <FormField 
          id="email" 
          label="Email" 
          type="email"
          placeholder="tu@email.com" 
          autoComplete="email" 
          required 
        />
        
        <FormField 
          id="password" 
          label="Contraseña" 
          type="password"
          placeholder="••••••••" 
          autoComplete="current-password" 
          required 
        />
        
        <SubmitButton label="Iniciar sesión"/>
      </FormCard>
    </div>
  );
}

export default LoginPage;