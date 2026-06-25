import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAdminDoctors } from "@/features/admin/hooks/useAdminDoctors";
import AdminDoctorList from "@/features/admin/AdminDoctorList";
import { Search, UserPlus, Loader2 } from "lucide-react";

function AdminDoctorSearchPage() {
    const { doctors, isLoading, error } = useAdminDoctors();
    const [search, setSearch] = useState("");

    const filteredDoctors = useMemo(() => {
        const term = search.toLowerCase().trim();
        if (!term) return doctors;

        return doctors.filter((doctor) => {
            const fullName = `${doctor.firstName} ${doctor.lastName}`.toLowerCase();
            return fullName.includes(term);
        });
    }, [doctors, search]);

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-5xl space-y-6">

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <h1 className="text-xl font-bold text-text flex items-center gap-2">
                            Buscar Médicos
                        </h1>
                        <p className="text-sm text-text-muted mt-1">Encuentre y gestione médicos registrados en el sistema.</p>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto">
                        <Link
                            to="/admin/employee"
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors shadow-sm"
                        >
                            <UserPlus className="h-4 w-4" />
                            Crear Médico
                        </Link>
                    </div>
                </div>

                <div className="bg-surface border border-surface-alt rounded-2xl p-6 shadow-sm">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-background border border-surface-alt rounded-xl text-text focus:outline-none focus:border-primary transition-colors"
                        />
                    </div>
                </div>

                <div className="bg-surface rounded-2xl border border-surface-alt shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 text-primary animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12 text-red-500">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-4 border-b border-surface-alt">
                                <p className="text-sm text-text-muted">
                                    {filteredDoctors.length} médicos encontrados
                                </p>
                            </div>
                            <AdminDoctorList doctors={filteredDoctors} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDoctorSearchPage;
