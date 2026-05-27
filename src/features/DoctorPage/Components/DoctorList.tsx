import type { Doctor } from "../../utils/Employees";
import DoctorCard from "../../DoctorPage/Components/DoctorCard";

interface DoctorListProps {
  doctors: Doctor[];
}

export default function DoctorList({
  doctors,
}: DoctorListProps) {
  if (doctors.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6">
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
        />
      ))}
    </div>
  );
}