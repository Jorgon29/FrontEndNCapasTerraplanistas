import { useMemo, useState, useEffect } from "react";
import { usePatientDoctors, type PublicDoctor } from "@/features/search/hooks/usePatientDoctors";
import { Search, Loader2, Calendar, DollarSign, ChevronLeft, ChevronRight } from "lucide-react";

interface PatientDoctorSearchProps {
  onInteract: (doctor: PublicDoctor) => void;
}

export default function PatientDoctorSearch({ onInteract }: PatientDoctorSearchProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);

  const { doctors, isLoading, error, refetch, totalPages, currentPage } = usePatientDoctors(debouncedSearch, page);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
        <input
          type="text"
          placeholder="Buscar por nombre o especialidad..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-surface-alt rounded-xl text-text focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      <p className="text-sm text-text-muted">
        {doctors.length} doctores encontrados
      </p>

      {doctors.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>No se encontraron doctores</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {doctors.map((doctor) => (
            <div
              key={doctor.id}
              onClick={() => onInteract(doctor)}
              className="bg-background rounded-2xl shadow-md p-5 cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-text">
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h2>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onInteract(doctor);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Get Appointment
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {doctor.specialties.map((specialty) => (
                  <span
                    key={specialty.specialtyId}
                    className="bg-surface-alt text-primary-dark px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {specialty.name}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {doctor.specialties.slice(0, 2).map((specialty) => (
                  <div key={specialty.specialtyId} className="flex items-center gap-4 text-sm text-text-muted">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${specialty.feePerHour}/hora</span>
                    </div>
                    <span>•</span>
                    <span>{specialty.consultDurationMinutes} min consulta</span>
                    <span>•</span>
                    <span>Lic: {specialty.professionalLicenseNumber}</span>
                  </div>
                ))}
                {doctor.specialties.length > 2 && (
                  <p className="text-sm text-text-muted">
                    +{doctor.specialties.length - 2} más especialidades
                  </p>
                )}
              </div>

              {doctor.specialties.some(s => s.availability.length > 0) && (
                <div className="mt-3 pt-3 border-t border-surface-alt">
                  <p className="text-xs text-text-muted">
                    Disponibilidad: {formatAvailabilitySummary(doctor.specialties)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 0}
            className="flex items-center gap-1 px-4 py-2 bg-surface-alt text-text rounded-lg hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </button>
          <span className="text-sm text-text-muted">
            Página {currentPage + 1} de {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage >= totalPages - 1}
            className="flex items-center gap-1 px-4 py-2 bg-surface-alt text-text rounded-lg hover:bg-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function formatAvailabilitySummary(specialties: PublicDoctor["specialties"]) {
  const days = new Set<string>();
  specialties.forEach(s => {
    s.availability.forEach(a => {
      days.add(a.dayOfWeek);
    });
  });
  const dayNames: Record<string, string> = {
    MONDAY: "Lun", TUESDAY: "Mar", WEDNESDAY: "Mié", THURSDAY: "Jue",
    FRIDAY: "Vie", SATURDAY: "Sáb", SUNDAY: "Dom"
  };
  return Array.from(days).slice(0, 5).map(d => dayNames[d] || d).join(", ");
}