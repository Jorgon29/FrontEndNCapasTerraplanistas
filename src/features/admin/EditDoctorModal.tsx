import type { Doctor, Speciality } from "../utils/Employees";

interface EditDoctorModalProps {
    doctor: Doctor
}

function EditDoctorModal(doctor: EditDoctorModalProps) {

    return (
        <div>
            <label>Nombre/s</label>
            <input placeholder={doctor.doctor.first_name} type="text"></input>
            <label>Apellido/s</label>
            <input placeholder={doctor.doctor.last_name} type="text"></input>
            {doctor.doctor.specialties.map((spec: Speciality) => {
                return (
                    <div>
                        <label>{spec.name}</label>
                        <input placeholder={spec.feePerHour.toString()}></input>
                    </div>
                );
            })}
        </div>
    );
}

export default EditDoctorModal;