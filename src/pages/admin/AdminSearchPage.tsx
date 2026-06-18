import type { Doctor } from "@/features/utils/Employees";
import { useState } from "react";
import DoctorSearchPage from "../doctor/DoctorSearchPage";

function AdminSearchPage() {

    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    return (

        <div className="min-h-screen bg-background font-sans text-text">
            <DoctorSearchPage 
                onInteract={(arg0: Doctor) => {setSelectedDoctor(arg0);}}
            />
        </div>

    );
}

export default AdminSearchPage;