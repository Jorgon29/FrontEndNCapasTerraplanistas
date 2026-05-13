import { Link } from "react-router";
import { Logo } from "./NavBar";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-2xl px-10 py-20 text-center">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
        Empieza hoy
      </p>
      <h2 className="mb-4 font-serif text-4xl leading-snug tracking-tight text-text">
        Tu primera consulta<br />sin costo
      </h2>
      <p className="mb-8 text-lg font-light leading-relaxed text-text-muted">
        Regístrate ahora y accede a una consulta gratuita con cualquiera de nuestros médicos generales.
      </p>
      <Link
        to="/register"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-white transition-all hover:-translate-y-px hover:bg-primary-dark"
      >
        👤 Crear cuenta gratis
      </Link>
    </section>
  );
}

export default function Footer() {
  return (
    <footer className="flex items-center justify-between border-t border-surface-alt bg-surface px-10 py-6">
      <Logo />
      <p className="text-sm text-text-muted">© 2025 TeleMédica — Proyecto universitario</p>
      <ul className="flex gap-6 list-none">
        <li><Link to="/privacy" className="text-sm text-text-muted transition-colors hover:text-primary">Privacidad</Link></li>
        <li><a href="#" className="text-sm text-text-muted transition-colors hover:text-primary">Términos</a></li>
        <li><a href="#" className="text-sm text-text-muted transition-colors hover:text-primary">Contacto</a></li>
      </ul>
    </footer>
  );
}
