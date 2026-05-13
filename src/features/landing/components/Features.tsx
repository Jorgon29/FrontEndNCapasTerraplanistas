import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faClipboard, faClock, faFile } from "@fortawesome/free-regular-svg-icons";
import { faFilm, faLock, faStethoscope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Feature {
  icon: IconDefinition;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  { icon: faFilm, title: "Videoconsultas HD",       description: "Consultas por video de alta calidad con tu médico desde cualquier dispositivo." },
  { icon: faClock, title: "Disponibilidad 24/7",     description: "Accede a médicos de guardia en cualquier momento." },
  { icon: faFile, title: "Recetas digitales",       description: "Recibe tus recetas y órdenes de laboratorio de forma digital e inmediata." },
  { icon: faLock, title: "Privacidad garantizada",  description: "Tus datos médicos protegidos con cifrado de nivel bancario en todo momento." },
  { icon: faStethoscope, title: "Especialistas verificados", description: "Todos nuestros médicos están certificados y validados por el colegio médico." },
  { icon: faClipboard, title: "Historial clínico",       description: "Accede a tu historial completo de consultas y diagnósticos en un solo lugar." },
];

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-10 py-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent">
        Por qué elegirnos
      </p>
      <h2 className="mb-12 font-serif text-4xl leading-snug tracking-tight text-text">
        Salud pensada<br />para tu vida
      </h2>

      <div className="grid grid-cols-3 gap-6">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-surface-alt bg-surface p-7 transition-all hover:-translate-y-0.5 hover:border-accent/40"
          >
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-background text-xl">
              <FontAwesomeIcon icon={f.icon} />
            </div>
            <h3 className="mb-2 text-sm font-medium text-text">{f.title}</h3>
            <p className="text-sm font-light leading-relaxed text-text-muted">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
