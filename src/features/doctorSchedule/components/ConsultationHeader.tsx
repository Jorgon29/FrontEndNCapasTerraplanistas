import { faPhoneSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConsultation } from "../providers/ConsultationProvider";

interface ConsultationHeaderProps {
    onClose: () => void;
}

function ConsultationHeader({ onClose }: ConsultationHeaderProps) {

    const {appointment, message} = useConsultation();

    return (
        <>
            {message && (
                <div className={`m-4 p-3 rounded-xl text-sm font-medium text-center ${message.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"}`}>
                    {message.text}
                </div>
            )}
            <div className="p-4 bg-background border-b border-primary-light/10 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">Consulta Virtual</h2>
                    <p className="text-xs text-text/60 soft-text">Paciente: <span className="font-semibold">{appointment?.patient_name}</span></p>
                </div>
                <button onClick={onClose} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer">
                    <FontAwesomeIcon icon={faPhoneSlash} /> Terminar llamada
                </button>
            </div>
        </>

    );
}

export default ConsultationHeader;