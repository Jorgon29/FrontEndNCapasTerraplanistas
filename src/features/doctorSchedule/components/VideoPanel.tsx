import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useConsultation } from "../providers/ConsultationProvider";

function VideoPanel() {
  const { appointment } = useConsultation();

  if (appointment?.status === "COMPLETED") return null;

  return (
    <div className="w-1/2 p-6 bg-zinc-900 flex flex-col justify-between text-white relative">
      <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono tracking-widest text-emerald-400 animate-pulse">
        ● EN VIVO
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="text-2xl font-light italic text-zinc-400 mb-4">
          Videollamada con {appointment?.patient_name}
        </div>
        <a
          href={appointment?.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors"
        >
          <FontAwesomeIcon icon={faVideo} />
          Unirse a Google Meet
        </a>
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <span className="text-xs uppercase text-zinc-400 tracking-wider block mb-1">Enlace alternativo</span>
        <a
          href={appointment?.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline text-sm break-all font-mono"
        >
          {appointment?.meeting_link}
        </a>
      </div>
    </div>
  );
}

export default VideoPanel;
