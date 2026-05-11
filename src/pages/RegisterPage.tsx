import { useState } from "react";

import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { Link } from "react-router";

function RegisterPage() {

  const [selected, setSelected] = useState<Date>();

  return (
    <form className="w-full max-w-md rounded-2xl bg-background p-8 shadow-lg scroll-auto">
      <div className="space-y-5">
        <div>
          <label htmlFor="femail" className="block text-sm font-medium text-text dark:text-text-muted">
            Email
          </label>
          <input
            id="femail"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
            placeholder="tu@email.com"
          />
        </div>

        <div className="flex flex-row flex-wrap gap-x-4">
          <div className="flex-1">
            <label htmlFor="ffirstname" className="block text-sm font-medium text-text dark:text-text-muted">
              1er nombre
            </label>
            <input
              id="ffirstname"
              name="ffirstname"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
              placeholder="primer nombre"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="fsecondname" className="block text-sm font-medium text-text dark:text-text-muted">
              2do nombre
            </label>
            <input
              id="fsecondname"
              name="fsecondname"
              type="text"
              className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
              placeholder="segundo nombre"
            />
          </div>
        </div>

        <div className="flex flex-row flex-wrap gap-x-4">
          <div className="flex-1">
            <label htmlFor="ffirstsurname" className="block text-sm font-medium text-text dark:text-text-muted">
              1er apellido
            </label>
            <input
              id="ffirstsurname"
              name="ffirstsurname"
              type="text"
              required
              className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
              placeholder="primer apellido"
            />
          </div>

          <div className="flex-1">
            <label htmlFor="fsecondsurname" className="block text-sm font-medium text-text dark:text-text-muted">
              2do apellido
            </label>
            <input
              id="fsecondsurname"
              name="fsecondsurname"
              type="text"
              className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
              placeholder="segundo apellido"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fdui" className="block text-sm font-medium text-text dark:text-text-muted">
            DUI
          </label>
          <input
            id="fdui"
            name="dui"
            type="dui"
            required
            className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
            placeholder="00000000-0"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <label className="text-text dark:text-text ">Fecha de nacimiento</label>
          <DayPicker
            animate
            mode="single"
            selected={selected}
            onSelect={setSelected}
            defaultMonth={new Date(1999, 12)}
            fixedWeeks
            className="flex-1"
          />
        </div>

        <div>
          <label htmlFor="fpassword" className="block text-sm font-medium text-text dark:text-text">
            Contraseña
          </label>
          <input
            id="fpassword"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="fpassword" className="block text-sm font-medium text-text dark:text-text">
            Contraseña (repite)
          </label>
          <input
            id="fpassword"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-row flex-wrap gap-x-4">
          <input 
            id="fprivacy"
            name="fprivacy"
            type="checkbox"
            required
            className="accent-primary flex-1 mt-1 block w-full rounded-lg border border-primary-light bg-background px-4 py-2.5 text-text placeholder-text-muted transition-colors focus:border-accent focus:ring-2 focus:ring-accent-dark focus:outline-none dark:border-text-muted dark:bg-accent-dark dark:text-text dark:placeholder-text-muted dark:focus:border-accent-light dark:focus:ring-accent-dark"
          />
          <label className="flex-1 block text-sm font-medium text-text dark:text-text">
            He leído y acepto el <Link to={"/privacy"} className="text-accent"> aviso de privacidad</Link> de Telemedicina
            
          </label>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary-light focus:ring-offset-2 active:bg-accent dark:focus:ring-text"
        >
          Registrar
        </button>
      </div>
    </form>
  );
}

export default RegisterPage;