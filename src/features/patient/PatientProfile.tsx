import { useAuth } from "../auth/providers/AuthProvider";

function PatientProfile(){
    const {patient} = useAuth();

    return (
        <div>
            <h1>Perfil de paciente</h1>
            <p>{patient?.first_name} {patient?.last_name}</p>
            
        </div>
    );
}

export default PatientProfile;