import { useState } from "react";
import type { Doctor, Speciality } from "../utils/Employees";
import ManageSchedulesModal from "./ManageSchedulesModal";

interface EditDoctorModalProps {
  doctor: Doctor;
  onClose: () => void;
}

function EditDoctorModal({ doctor, onClose }: EditDoctorModalProps) {
  const [isActive, setIsActive] = useState<boolean>(doctor.is_active ?? true);
  const [firstName, setFirstName] = useState(doctor.first_name);
  const [lastName, setLastName] = useState(doctor.last_name);
  const [isManageSchedulesOpen, setIsManageSchedulesOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20 p-4">
        <div className="bg-background text-text rounded-2xl w-full max-w-lg flex flex-col overflow-hidden shadow-2xl border border-surface-alt">

          <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt">
            <div>
              <h2 className="text-base font-semibold">Editar doctor</h2>
              <p className="text-xs text-text-muted mt-0.5">
                {doctor.first_name} {doctor.last_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-surface-alt hover:text-text transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="overflow-y-auto p-6 space-y-5">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                  Nombre/s
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                  Apellido/s
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
                Estado de la cuenta
              </label>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2.5 flex-1 cursor-pointer rounded-xl border p-3 transition-colors ${isActive
                  ? "border-success bg-success/10 text-success"
                  : "border-surface-alt bg-surface text-text-muted"
                  }`}>
                  <input
                    type="radio"
                    name="isActive"
                    checked={isActive}
                    onChange={() => setIsActive(true)}
                    className="accent-success"
                  />
                  <span className="text-sm font-medium">Activo</span>
                </label>

                <label className={`flex items-center gap-2.5 flex-1 cursor-pointer rounded-xl border p-3 transition-colors ${!isActive
                  ? "border-danger bg-danger/10 text-danger"
                  : "border-surface-alt bg-surface text-text-muted"
                  }`}>
                  <input
                    type="radio"
                    name="isActive"
                    checked={!isActive}
                    onChange={() => setIsActive(false)}
                    className="accent-danger"
                  />
                  <span className="text-sm font-medium">No activo</span>
                </label>
              </div>
            </div>

            {doctor.specialties.map((spec: Speciality) => (
              <div key={spec.id} className="rounded-xl border border-surface-alt bg-surface p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-accent">
                  {spec.name}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                      Costo por hora
                    </label>
                    <input
                      type="number"
                      defaultValue={spec.feePerHour}
                      className="w-full bg-background border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                      Minutos por consulta
                    </label>
                    <input
                      type="number"
                      defaultValue={spec.duration}
                      className="w-full bg-background border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-text"
                    />
                  </div>
                  
                </div>
              </div>
            ))}

            <button onClick={() => setIsManageSchedulesOpen(true)} className="cursor-pointer flex-1 rounded-xl bg-primary p-5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors">
                    Editar horarios
                  </button>
          </div>

          <div className="flex gap-3 px-6 py-4 border-t border-surface-alt shrink-0">
            <button
              onClick={onClose}
              className="cursor-pointer flex-1 rounded-xl border border-surface-alt py-2.5 text-sm font-semibold text-text-muted hover:bg-surface-alt transition-colors"
            >
              Cancelar
            </button>
            <button
              className="cursor-pointer flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>

      {isManageSchedulesOpen && (
        <ManageSchedulesModal
          doctor={doctor}
          onClose={() => setIsManageSchedulesOpen(false)}
        />
      )}

    </>
  );
}

export default EditDoctorModal;