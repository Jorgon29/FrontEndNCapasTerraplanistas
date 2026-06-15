import { faNotesMedical, faPills } from "@fortawesome/free-solid-svg-icons";
import { useConsultation } from "../providers/ConsultationProvider";
import MedicalRecordForm from "./MedicalRecordForm";
import PrescriptionForm from "./PrescriptionForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ConsultationPanel() {

    const { activeTab, setActiveTab, setMessage, appointment } = useConsultation();

    return (
        <>
            <div className="flex bg-muted border-b border-primary-light/10">
                <button
                    onClick={() => { setActiveTab("record"); setMessage(null); }}
                    className={`flex-1 py-3 text-sm font-medium transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${activeTab === "record" ? "border-primary text-primary bg-background" : "border-transparent text-text/60 hover:text-text"}`}
                >
                    <FontAwesomeIcon icon={faNotesMedical} /> Historia Clínica
                </button>
                { !(appointment?.status === "COMPLETED") &&
                <button
                    onClick={() => { setActiveTab("prescription"); setMessage(null); }}
                    className={`flex-1 py-3 text-sm font-medium transition-all cursor-pointer border-b-2 flex items-center justify-center gap-2 ${activeTab === "prescription" ? "border-primary text-primary bg-background" : "border-transparent text-text/60 hover:text-text"}`}
                >
                    <FontAwesomeIcon icon={faPills} /> Receta Médica
                </button>
                }
            </div>

            {activeTab === "record" ? <MedicalRecordForm />
                : <PrescriptionForm />
            }
        </>
    );
}

export default ConsultationPanel;