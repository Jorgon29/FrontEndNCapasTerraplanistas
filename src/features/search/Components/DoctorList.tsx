import type { Doctor } from "../../utils/Employees";
import DoctorCard from "./DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
  onInteract: (arg0: Doctor) => void;
}

export default function DoctorList({
  doctors,
  onInteract
}: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <p className="text-center text-text-muted mt-6">
        No se encontraron doctores
      </p>
    );
  }

  return (
    <div className="grid gap-4 mt-6">
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          doctor={doctor}
          onInteract={() => onInteract(doctor)}
        />
      ))}
    </div>
  );
}