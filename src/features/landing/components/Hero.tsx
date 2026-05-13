import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router";

const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00"];

function BookingCard() {
  const [selected, setSelected] = useState("09:30");

  return (
    <div className="relative flex justify-center">
      {/* floating pills */}
      <span className="absolute -top-4 -right-2 flex items-center gap-2 rounded-full border border-surface-alt bg-surface px-3 py-1.5 text-xs font-medium text-text shadow-sm">
        <span className="h-2 w-2 rounded-full bg-success" />
        3 doctores disponibles ahora
      </span>

      <div className="w-72 rounded-2xl border border-surface-alt bg-surface p-6">
        {/* doctor header */}
        <div className="mb-5 flex items-center gap-3 border-b border-surface-alt pb-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background font-serif text-lg text-primary">
            Dr
          </div>
          <div>
            <p className="text-sm font-medium text-text">Dra. Ana Herrera</p>
            <p className="text-xs text-text-muted">Medicina General</p>
          </div>
          <span className="ml-auto rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">
            Disponible
          </span>
        </div>

        <p className="mb-2.5 text-xs font-medium text-text-muted">Horarios disponibles — hoy</p>

        {/* time slots */}
        <div className="mb-5 grid grid-cols-3 gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelected(slot)}
              className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                selected === slot
                  ? "border-primary bg-primary text-white"
                  : "border-surface-alt bg-background text-accent hover:border-primary hover:bg-primary hover:text-white"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>

        <Link
          to="/auth/register"
          className="block w-full rounded-xl bg-primary py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          Confirmar cita
        </Link>
      </div>

      <span className="absolute -bottom-2 -left-4 flex items-center gap-1.5 rounded-full border border-surface-alt bg-surface px-3 py-1.5 text-xs font-medium text-text shadow-sm">
        <FontAwesomeIcon icon={faLock}/> Cifrado extremo a extremo
      </span>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-12 px-10 pb-16 pt-20">
      {/* left copy */}
      <div>
        <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-surface-alt px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
          ✓ Consultas certificadas
        </span>
        <h1 className="mb-5 font-serif text-5xl leading-tight tracking-tight text-text">
          Tu médico,{" "}
          <em className="not-italic text-primary">a un clic</em>{" "}
          de distancia
        </h1>
        <p className="mb-8 max-w-md text-lg font-light leading-relaxed text-text-muted">
          Agenda videoconsultas con especialistas verificados sin salir de casa.
          Atención médica de calidad, cuando y donde la necesites.
        </p>
        <div className="flex items-center gap-4">
          <Link
            to="/auth/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 text-sm font-medium text-white transition-all hover:-translate-y-px hover:bg-primary-dark"
          >
            <FontAwesomeIcon icon={faCalendar}/> Agendar consulta
          </Link>
          <a href="#features" className="group inline-flex items-center gap-1 text-sm font-medium text-primary transition-all">
            Ver especialidades
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </a>
        </div>
      </div>

      <BookingCard />
    </section>
  );
}