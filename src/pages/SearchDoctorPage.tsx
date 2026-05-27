import Footer from "@/features/landing/components/Footer"
import Navbar from "@/features/landing/components/NavBar"
import DoctorPage from "@/features/DoctorPage/DoctorPage"

export default function SearchDoctor(){


    return(
    <div className="min-h-screen bg-background font-sans text-text">
          <Navbar />
          <DoctorPage />
          
          <Footer />
        </div>
)



}