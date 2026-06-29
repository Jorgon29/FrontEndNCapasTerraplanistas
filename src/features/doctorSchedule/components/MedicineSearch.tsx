import apiClient from "@/lib/apiClient";
import { useEffect, useState } from "react";

export interface Medicine {
    id: string;
    name: string;
    genericName: string;
    atcCode: string;
}

interface MedicineSearchProps {
    onSelect: (medicine: Medicine) => void;
    initialValue?: string;
}

function MedicineSearch({ onSelect, initialValue = "" }: MedicineSearchProps) {
    const [searchTerm, setSearchTerm] = useState(initialValue);
    const [medicineResults, setMedicineResults] = useState<Medicine[]>([]);
    const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        if (!searchTerm.trim()) {
            setMedicineResults([]);
            return;
        }

        if (selectedMedicine && searchTerm === selectedMedicine.name) return;

        const delaySearch = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await apiClient.get(`/medicines?search=${encodeURIComponent(searchTerm)}&size=20`);
                const data = res.data?.data || [];
                setMedicineResults(data.map((med: any) => ({
                    id: med.id,
                    name: med.brandName,
                    genericName: med.genericName || "",
                    atcCode: med.atcCode || ""
                })));
            } catch {
                setMedicineResults([]);
            } finally {
                setIsSearching(false);
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
                            className="p-2.5 text-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer flex flex-col gap-0.5"
                            onMouseDown={() => handleSelect(med)}
                        >
                            <span className="font-medium">{med.name}</span>
                            <div className="flex gap-2 items-center">
                                {med.genericName && (
                                    <span className="text-[10px] text-text-muted">{med.genericName}</span>
                                )}
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wide">
                                    {med.atcCode}
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {showDropdown && searchTerm && medicineResults.length === 0 && !isSearching && (
                <div className="absolute z-50 w-full left-0 mt-1 bg-background border border-primary-light/20 rounded-xl p-3 text-xs text-text/50 italic shadow-xl">
                    No se encontraron coincidencias.
                </div>
            )}
        </div>
    );
}

export default MedicineSearch;