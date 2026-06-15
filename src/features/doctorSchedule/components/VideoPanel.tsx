import { useConsultation } from "../providers/ConsultationProvider";

function VideoPanel() {
  const { appointment } = useConsultation();

  if (appointment?.status === "COMPLETED") return null;

  return (
    <div className="w-1/2 p-6 bg-zinc-900 flex flex-col justify-between text-white relative">
      <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-xs font-mono tracking-widest text-emerald-400 animate-pulse">
        ● EN VIVO
      </div>
      <div className="flex-1 flex items-center justify-center text-2xl font-light italic text-zinc-400">
        Videollamada con {appointment?.patient_name}
      </div>
      <div className="bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-md">
        <span className="text-xs uppercase text-zinc-400 tracking-wider block mb-1">Enlace alternativo</span>
        
          href={appointment?.meeting_link}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline text-sm break-all font-mono"
        <a>
          {appointment?.meeting_link}
        </a>
      </div>
    </div>
  );
}

export default VideoPanel;