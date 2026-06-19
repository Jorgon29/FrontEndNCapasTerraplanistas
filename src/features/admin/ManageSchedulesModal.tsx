import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import type { Doctor, Speciality } from "../utils/Employees";
import { DayOfTheWeek, dayToSpanish } from "../utils/DaysOfTheWeek";
import type { OfficeHours } from "../utils/OfficeHours";
import useEditDoctor from "./hooks/useEditDoctor";

interface ManageSchedulesModalProps {
  doctor: Doctor;
  onClose: () => void;
}

export default function ManageSchedulesModal({ doctor, onClose }: ManageSchedulesModalProps) {
  if (!doctor.specialties[0]?.id) {
    return <></>;
  }

  const {
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    localSpecialties,
    newDay,
    setNewDay,
    newStart,
    setNewStart,
    newEnd,
    setNewEnd,
    isSubmitting,
    activeSpecialty,
    formatToHTML,
    handleCreate,
    handleDelete,
  } = useEditDoctor(doctor);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-60 p-4">
      <div className="bg-background rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl border border-surface-alt flex flex-col">
        
        <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-text">Gestión de Horarios</h2>
            <p className="text-xs text-text-muted mt-0.5">Dr. {doctor.first_name} {doctor.last_name}</p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-text/70">
              Seleccionar Especialidad
            </label>
            <select
              value={selectedSpecialtyId}
              onChange={(e) => setSelectedSpecialtyId(e.target.value)}
              className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary"
            >
              {localSpecialties.map((spec: Speciality) => (
                <option key={spec.id} value={spec.id}>{spec.name}</option>
              ))}
            </select>
          </div>

          <div className="border border-surface-alt rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm text-text">
              <thead className="bg-surface border-b border-surface-alt text-xs uppercase text-text-muted">
                <tr>
                  <th className="px-4 py-3">Día</th>
                  <th className="px-4 py-3">Inicio</th>
                  <th className="px-4 py-3">Fin</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-alt bg-background">
                {activeSpecialty?.officeHours.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-text-muted italic">
                      No hay horarios registrados para esta especialidad.
                    </td>
                  </tr>
                ) : (
                  activeSpecialty?.officeHours.map((hour: OfficeHours, index: number) => (
                    <tr key={hour.id || index} className="hover:bg-surface/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-center">{dayToSpanish(hour.day)}</td>
                      <td className="px-4 py-3 text-center">{formatToHTML(hour.startTime)}</td>
                      <td className="px-4 py-3 text-center">{formatToHTML(hour.endTime)}</td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => hour.id && handleDelete(hour.id)}
                          disabled={!hour.id}
                          className="cursor-pointer text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                          title="Eliminar turno"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive Row Entry Action Field */}
          <div className="bg-surface border border-surface-alt p-4 rounded-xl flex items-end gap-4">
            <div className="flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-text/70">Día</label>
              <select value={newDay} onChange={(e) => setNewDay(Number(e.target.value))} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm text-text focus:outline-none focus:border-primary">
                <option value={DayOfTheWeek.MONDAY}>Lunes</option>
                <option value={DayOfTheWeek.TUESDAY}>Martes</option>
                <option value={DayOfTheWeek.WEDNESDAY}>Miércoles</option>
                <option value={DayOfTheWeek.THURSDAY}>Jueves</option>
                <option value={DayOfTheWeek.FRIDAY}>Viernes</option>
                <option value={DayOfTheWeek.SATURDAY}>Sábado</option>
                <option value={DayOfTheWeek.SUNDAY}>Domingo</option>
              </select>
            </div>

            <div className="w-32">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-text/70">Inicio</label>
              <input type="time" required value={newStart} onChange={(e) => setNewStart(e.target.value)} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm text-text focus:outline-none focus:border-primary" />
            </div>

            <div className="w-32">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-1 text-text/70">Fin</label>
              <input type="time" required value={newEnd} onChange={(e) => setNewEnd(e.target.value)} className="w-full bg-background border border-surface-alt rounded-lg p-2 text-sm text-text focus:outline-none focus:border-primary" />
            </div>

            <button
              onClick={handleCreate}
              disabled={isSubmitting || !selectedSpecialtyId}
              className="bg-primary text-white rounded-lg px-6 py-2 h-9.5 text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "..." : <><FontAwesomeIcon icon={faPlus} className="mr-2" /> Agregar</>}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}