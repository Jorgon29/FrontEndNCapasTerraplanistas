const BRANDS = ["SaludPlus", "MediRed", "ClínicaVerde", "BioSalud", "MedCenter"];

export default function TrustedBy() {
  return (
    <div className="border-y border-surface-alt bg-surface px-10 py-6 text-center">
      <p className="mb-4 text-xs font-medium uppercase tracking-widest text-text-muted">
        Confiado por instituciones de salud
      </p>
      <div className="flex flex-wrap items-center justify-center gap-10">
        {BRANDS.map((b) => (
          <span key={b} className="font-serif text-base text-text-muted opacity-60">
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}
