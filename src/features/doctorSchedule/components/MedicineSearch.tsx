import BASE_URL from "@/config/config";
import { useEffect, useState } from "react";

export interface Medicine {
    id: string;
    name: string;
    category: string;
}

const MOCK_MEDICINES: Medicine[] = [
    { id: "101", name: "Amlodipino 5mg (Tableta)", category: "Cardio" },
    { id: "102", name: "Paracetamol 500mg (Tableta)", category: "Analgésico" },
    { id: "103", name: "Metformina 850mg (Tableta)", category: "Antidiabético" },
    { id: "104", name: "Amoxicilina 500mg (Cápsula)", category: "Antibiótico" },
    { id: "105", name: "Losartán 500mg (Tableta)", category: "Cardio" },
];

interface MedicineSearchProps {
    onSelect: (medicine: Medicine) => void;
    initialValue?: string;
}

function MedicineSearch({ onSelect, initialValue = "" }: MedicineSearchProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setMedicineResults([]);
            return;
        }

        if (selectedMedicine && searchTerm === selectedMedicine.name) return;

        const delaySearch = setTimeout(async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/medicines?search=${encodeURIComponent(searchTerm)}`);
                if (!response.ok) throw new Error();
                const data = await response.json();
                setMedicineResults(data);
            } catch {
                setMedicineResults(
                    MOCK_MEDICINES.filter((med) =>
                        med.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                );
            }
        }, 300);

        return () => clearTimeout(delaySearch);
    }, [searchTerm, selectedMedicine]);

    const handleSelect = (med: Medicine) => {
        setSelectedMedicine(med);
        setSearchTerm(med.name);
        setShowDropdown(false);
        onSelect(med);
    };

    return (
        <div className="relative">
            <input
                required
                type="text"
                placeholder="Escriba para buscar fármaco..."
                autoComplete="off"
                className="w-full bg-muted border border-primary-light/20 rounded-lg p-2.5 text-sm focus:outline-primary"
                value={searchTerm}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (selectedMedicine && e.target.value !== selectedMedicine.name) {
                        setSelectedMedicine(null);
                    }
                }}
            />

            {showDropdown && medicineResults.length > 0 && (
                <ul className="absolute z-50 w-full left-0 mt-1 bg-background border border-primary-light/20 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-primary-light/10">
                    {medicineResults.map((med) => (
                        <li
                            key={med.id}
                            className="p-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer flex justify-between items-center"
                            onMouseDown={() => handleSelect(med)}
                        >
                            <span className="font-medium">{med.name}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
                                {med.category}
                            </span>
                        </li>
                    ))}
                </ul>
            )}

            {showDropdown && searchTerm && medicineResults.length === 0 && (
                <div className="absolute z-50 w-full left-0 mt-1 bg-background border border-primary-light/20 rounded-xl p-3 text-xs text-text/50 italic shadow-xl">
                    No se encontraron coincidencias.
                </div>
            )}
        </div>
    );
}

export default MedicineSearch;