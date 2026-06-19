import type { Doctor } from "@/features/utils/Employees";
import { useState } from "react";
import DoctorSearchPage from "../doctor/DoctorSearchPage";
import EditDoctorModal from "@/features/admin/EditDoctorModal";
import { set } from "date-fns";

function AdminSearchPage() {

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    return (

        <>
            <div className="min-h-screen bg-background font-sans text-text">
                <DoctorSearchPage
                    onInteract={(arg0: Doctor) => { setSelectedDoctor(arg0); }}
                />
            </div>

            {(selectedDoctor) && (
                <EditDoctorModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)}/>
            )
            }
        </>
    );
}

export default AdminSearchPage;