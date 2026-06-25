import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { Loader2 } from "lucide-react";

interface Props {
    employeeId: string;
    specialtyId: string;
    specialtyName: string;
    onClose: () => void;
    onAdd: (dayOfWeek: string, startTime: string, endTime: string) => Promise<boolean>;
}

const DAYS_OF_WEEK = [
    { value: "MONDAY", label: "Lunes" },
    { value: "TUESDAY", label: "Martes" },
    { value: "WEDNESDAY", label: "Miércoles" },
    { value: "THURSDAY", label: "Jueves" },
    { value: "FRIDAY", label: "Viernes" },
    { value: "SATURDAY", label: "Sábado" },
    { value: "SUNDAY", label: "Domingo" },
];

export default function AddAvailabilityModal({ employeeId, specialtyId, specialtyName, onClose, onAdd }: Props) {
    const [dayOfWeek, setDayOfWeek] = useState("MONDAY");
    const [startTime, setStartTime] = useState("08:00");
    const [endTime, setEndTime] = useState("16:00");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateTimes = (): string | null => {
        if (!startTime || !endTime) {
            return "Ambos horarios son requeridos";
        }

        if (startTime >= endTime) {
            return "La hora de fin debe ser posterior a la hora de inicio";
        }

        const startMinutes = timeToMinutes(startTime);
        const endMinutes = timeToMinutes(endTime);
        const duration = endMinutes - startMinutes;

        if (duration < 30) {
            return "La duración mínima del horario es de 30 minutos";
        }

        return null;
    };

    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(":").map(Number);
        return hours * 60 + minutes;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateTimes();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const success = await onAdd(dayOfWeek, startTime, endTime);

        setIsSubmitting(false);

        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-surface-alt flex flex-col">
                <div className="px-6 py-4 border-b border-surface-alt flex justify-between items-center bg-surface">
                    <div className="flex items-center gap-3 text-primary">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <h2 className="text-lg font-semibold text-text">Agregar Horario</h2>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-text text-xl">✕</button>
                </div>

                <div className="px-6 py-4 bg-surface/50 border-b border-surface-alt">
                    <p className="text-sm text-text-muted">
                        Especialidad: <span className="text-text font-medium">{specialtyName}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-600 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                            Día de la Semana
                        </label>
                        <select
                            value={dayOfWeek}
                            onChange={e => setDayOfWeek(e.target.value)}
                            className="w-full bg-surface border border-surface-alt rounded-lg p-3 text-sm focus:border-primary focus:outline-none cursor-pointer"
                        >
                            {DAYS_OF_WEEK.map(day => (
                                <option key={day.value} value={day.value}>
                                    {day.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                Hora de Inicio
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faClock}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                                />
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={e => setStartTime(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-surface border border-surface-alt rounded-lg text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">
                                Hora de Fin
                            </label>
                            <div className="relative">
                                <FontAwesomeIcon
                                    icon={faClock}
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
                                />
                                <input
                                    type="time"
                                    value={endTime}
                                    onChange={e => setEndTime(e.target.value)}
                                    className="w-full pl-10 pr-3 py-3 bg-surface border border-surface-alt rounded-lg text-sm focus:border-primary focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface/50 rounded-lg p-3 text-xs text-text-muted">
                        <p>• Duración mínima: 30 minutos</p>
                        <p>• El horario no puede重叠 con otros existentes</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold text-text hover:bg-surface-alt transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center"
                        >
                            {isSubmitting ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <FontAwesomeIcon icon={faClock} className="mr-2" />
                            )}
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
