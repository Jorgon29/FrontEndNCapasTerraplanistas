import FormCard from "@/features/auth/components/FormCard";
import FormDatePicker from "@/features/auth/components/FormDatePicker";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import { useState } from "react";
import { Link } from "react-router";

function RegisterPage() {
    const [birthdate, setBirthdate] = useState<Date>(new Date(1999, 12));

    return (
        <FormCard>
            <h4>¿Ya tienes cuenta?</h4>
            <div className="m-4"></div>
            <Link to={"/auth/login"} className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background 
        transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 
        focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text cursor-pointer">Inicia sesión</Link>
            <div className="m-4"></div>

            <FormCard>

                <h2>Registrar</h2>
                <FormField id="email" label="Email" type="email" required placeholder="tu@email.com" autoComplete="email" />
                <div className="flex flex-row flex-wrap gap-x-4">
                    <FormField id="firstname" label="1er nombre" required className="flex-1" />
                    <FormField id="secondname" label="2do nombre" className="flex-1" />
                    <FormField id="firstsurname" label="1er apellido" required className="flex-1" />
                    <FormField id="secondsurname" label="2do apellido" className="flex-1" />
                </div>
                <FormField id="dui" label="dui" required />
                <FormDatePicker selected={birthdate} setSelected={setBirthdate} defaultDate={new Date(1999, 12)} label="Fecha de nacimiento" />
                <FormField id="password1" label="Contraseña" required type="password" />
                <FormField id="password2" label="Repite contraseña" required type="password" />
                <SubmitButton label="Registrar" />

            </FormCard>
        </FormCard>
    );
}

export default RegisterPage;