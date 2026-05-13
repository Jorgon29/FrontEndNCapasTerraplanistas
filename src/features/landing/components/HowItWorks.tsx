interface Step {
  number: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  { number: "1", title: "Crea tu cuenta",      description: "Regístrate con tu correo y verifica tu identidad en minutos." },
  { number: "2", title: "Elige especialista",  description: "Busca por especialidad, disponibilidad o calificación." },
  { number: "3", title: "Agenda tu cita",      description: "Selecciona el horario que más te convenga y confírmalo." },
  { number: "4", title: "Consulta en línea",   description: "Únete a la videollamada y recibe tu atención médica." },
];

export default function HowItWorks() {
  return (
    <section id="how" className="bg-text px-10 py-20">
      <div className="mx-auto max-w-6xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-accent-light">
          El proceso
        </p>
        <h2 className="mb-12 font-serif text-4xl leading-snug tracking-tight text-background">
          En cuatro pasos simples
        </h2>

        <div className="grid grid-cols-4 gap-6">
          {STEPS.map((step, i) => (
            <div key={step.number} className="relative text-center">
              {i < STEPS.length - 1 && (
                <div className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-px bg-primary/40" />
              )}
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-serif text-xl text-white">
                {step.number}
              </div>
              <h3 className="mb-2 text-sm font-medium text-background">{step.title}</h3>
              <p className="text-xs font-light leading-relaxed text-text-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
