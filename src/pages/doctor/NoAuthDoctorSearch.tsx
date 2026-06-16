import Footer from "@/features/landing/components/Footer"
import Navbar from "@/features/landing/components/NavBar"
import DoctorSearchPage from "@/pages/doctor/DoctorSearchPage"
import { useNavigate } from "react-router"

export default function NoAuthDoctorSearch(){
    const navigate = useNavigate();

    return(
    <div className="min-h-screen bg-background font-sans text-text">
          <Navbar />
          
          <DoctorSearchPage onInteract={() => {navigate("/auth/register");}} />
          <Footer />
        </div>
)



}