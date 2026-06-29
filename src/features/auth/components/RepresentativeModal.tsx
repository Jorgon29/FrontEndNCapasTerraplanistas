import { useState } from "react";
import apiClient from "@/lib/apiClient";

interface RepresentativeFormData {
  email: string;
  username: string;
  password: string;
  password2: string;
  relationshipType: string;
}

interface RepresentativeModalProps {
  patientId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const RELATIONSHIP_TYPES = [
  { value: "PARENT",    label: "Padre / Madre" },
  { value: "GUARDIAN",  label: "Tutor legal" },
  { value: "GRANDPARENT", label: "Abuelo / Abuela" },
  { value: "SIBLING",   label: "Hermano / Hermana mayor" },
  { value: "OTHER",     label: "Otro" },
];

export default function RepresentativeModal({
  patientId, onClose, onSuccess,
}: RepresentativeModalProps) {
  const [form, setForm] = useState<RepresentativeFormData>({
    email: "",
    username: "",
    password: "",
    password2: "",
    relationshipType: "PARENT",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (form.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setSubmitting(true);
    try {
      const userRes = await apiClient.post("/auth/register", {
        email: form.email,
        username: form.username,
        password: form.password,
        roleCode: "PATIENT",
      });
      if (userRes.status !== 200 && userRes.status !== 201) throw new Error("No se pudo crear la cuenta del representante.");
      const representativeUserId = userRes.data.data.id;

      const linkRes = await apiClient.post("/patient-representatives", {
        patientId,
        representativeUserId,
        relationshipType: form.relationshipType,
      });
      if (linkRes.status !== 200 && linkRes.status !== 201) throw new Error("No se pudo vincular al representante con el paciente.");

      onSuccess();
    } catch (err: any) {
      setError(err.message ?? "Ocurrió un error al registrar al representante.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-background text-text rounded-2xl w-full max-w-md flex flex-col overflow-hidden shadow-2xl border border-surface-alt"
        style={{ maxHeight: "90vh" }}>

        <div className="px-6 py-4 border-b border-surface-alt shrink-0">
          <h2 className="text-base font-semibold">Representante legal requerido</h2>
          <p className="text-xs text-text-muted mt-1 leading-relaxed">
            Como el paciente es menor de edad, necesitamos registrar a un representante
            legal con su propia cuenta para gestionar las citas.
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl text-xs font-medium bg-danger/10 border border-danger/20 text-danger shrink-0">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
              Parentesco con el paciente
            </label>
            <select
              value={form.relationshipType}
              onChange={(e) => setForm({ ...form, relationshipType: e.target.value })}
              className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
            >
              {RELATIONSHIP_TYPES.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className="h-px bg-surface-alt" />

          <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
            Cuenta del representante
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
              Email
            </label>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="representante@email.com"
              className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text placeholder-text-muted"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
              Nombre de usuario
            </label>
            <input
              required type="text" minLength={3} maxLength={50} value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                Contraseña
              </label>
              <input
                required type="password" minLength={8} value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                Repite contraseña
              </label>
              <input
                required type="password" minLength={8} value={form.password2}
                onChange={(e) => setForm({ ...form, password2: e.target.value })}
                className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-surface-alt py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-alt transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {submitting ? "Registrando..." : "Registrar representante"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}