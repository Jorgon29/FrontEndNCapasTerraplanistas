import { useState } from "react";
import { Link } from "react-router";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-alt bg-surface px-6 py-4">
      <Logo />

      <button
        className="md:hidden flex flex-col gap-1 p-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className="block h-0.5 w-6 bg-text-muted"></span>
        <span className="block h-0.5 w-6 bg-text-muted"></span>
        <span className="block h-0.5 w-6 bg-text-muted"></span>
      </button>

      <ul
        className={`absolute left-0 top-full w-full flex-col gap-4 bg-surface p-6 
              md:static md:flex md:flex-row md:items-center md:justify-evenly md:gap-8 md:p-0 
              ${isOpen ? "flex" : "hidden"}`}
      >
        <li><a href="#features" className="text-sm text-text-muted hover:text-primary">Especialidades</a></li>
        <li><a href="#how" className="text-sm text-text-muted hover:text-primary">Cómo funciona</a></li>
        <li><a href="#about" className="text-sm text-text-muted hover:text-primary">Sobre nosotros</a></li>
        <li><a href="/search" className="text-sm text-text-muted hover:text-primary">Encuentra a tu doctor de preferencia</a></li>
        <li>
          <Link to="/auth/login" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Iniciar Sesión
          </Link>
        </li>
        <li>
          <Link to="/auth/register" className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white hover:bg-primary-dark">
            Registrarse
          </Link>
        </li>
      </ul>

    </nav>
  );
}

export function Logo() {
  return (
    <span className="font-serif text-2xl tracking-tight text-primary">
      Tele<span className="text-accent">Médica</span>
    </span>
  );
}
