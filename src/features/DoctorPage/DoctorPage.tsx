
import SearchBar from "./Components/SearchBar";
import {useMemo, useState} from "react"
import { doctors } from "@/features/utils/testingEmployees";
import DoctorList from "./Components/DoctorList";

export default function DoctorPage() {
  const [search, setSearch] = useState("");

  const filteredDoctors = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      return doctors;
    }

    return doctors.filter((doctor) => {
      // Nombre completo
      const fullName =
        `${doctor.first_name} ${doctor.last_name}`.toLowerCase();

      const matchesName =
        fullName.includes(term);

      const matchesSpecialty =
        doctor.specialties.some((specialty) =>
          specialty.name
            .toLowerCase()
            .includes(term)
        );

    
      return (
        matchesName ||
        matchesSpecialty 
    
      );
    });
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto px-6 py-10">
        
   
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Buscar Doctores
          </h1>

          <p className="text-gray-500 mt-2">
            Busca por nombre o especialidad
          </p>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
        />

        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">
            {filteredDoctors.length} doctores encontrados
          </p>

          <DoctorList doctors={filteredDoctors} />
        </div>
      </div>
    </div>
  );
}