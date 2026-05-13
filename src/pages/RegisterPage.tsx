import FormCard from "@/features/auth/components/FormCard";
import FormDatePicker from "@/features/auth/components/FormDatePicker";
import FormField from "@/features/auth/components/FormField";
import SubmitButton from "@/features/auth/components/SubmitButton";
import { useState } from "react";

function RegisterPage(){
    const [birthdate, setBirthdate] = useState<Date>(new Date(1999, 12));

    return (
        <FormCard>
            <FormField id="email" label="Email" type="email" required placeholder="tu@email.com" autoComplete="email"/>
            <div className="flex flex-row flex-wrap gap-x-4">
                <FormField id="firstname" label="1er nombre" required className="flex-1" />
                <FormField id="secondname" label="2do nombre" className="flex-1"/>
                <FormField id="firstsurname" label="1er apellido" required className="flex-1"/>
                <FormField id="secondsurname" label="2do apellido" className="flex-1"/>
            </div>
            <FormField id="dui" label="dui" required/>
            <FormDatePicker selected={birthdate} setSelected={setBirthdate} defaultDate={new Date(1999, 12)} label="Fecha de nacimiento" />
            <FormField id="password1" label="Contraseña" required type="password" />
            <FormField id="password2" label="Repite contraseña" required type="password" />
            <SubmitButton label="Registrar" />
        </FormCard>
    );
}

export default RegisterPage;