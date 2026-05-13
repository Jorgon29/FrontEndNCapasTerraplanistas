import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-surface-alt bg-surface px-10 py-5">
      <Logo />
      <ul className="flex items-center gap-8 list-none">
        <li><a href="#features" className="text-sm text-text-muted transition-colors hover:text-primary">Especialidades</a></li>
        <li><a href="#how" className="text-sm text-text-muted transition-colors hover:text-primary">Cómo funciona</a></li>
        <li><a href="#about" className="text-sm text-text-muted transition-colors hover:text-primary">Sobre nosotros</a></li>
        <li>
          <Link
            to="/auth/register"
            className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
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
