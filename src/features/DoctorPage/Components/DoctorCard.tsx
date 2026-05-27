import type { Doctor } from "@/features/utils/Employees";

interface DoctorCardProps {
  doctor: Doctor;
}

export default function DoctorCard({
  doctor,
}: DoctorCardProps) {
  return (
    <div
      className="
        bg-white
        rounded-2xl
        shadow-md
        p-5
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">
            {doctor.first_name} {doctor.last_name}
          </h2>

          <p className="text-gray-500">
            Licencia:
            {" "}
            {doctor.professional_license_number}
          </p>

          <p className="text-blue-600 font-semibold mt-2">
            ${doctor.fee_per_hour}/hora
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {doctor.specialties.map((specialty) => (
          <span
            key={specialty.id}
            className="
              bg-blue-100
              text-blue-700
              px-3
              py-1
              rounded-full
              text-sm
              font-medium
            "
          >
            {specialty.name}
          </span>
        ))}
      </div>
    </div>
  );
}