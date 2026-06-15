import type { Appointment } from "@/features/utils/Appointment";
import { ConsultationProvider } from "../providers/ConsultationProvider";
import ConsultationHeader from "./ConsultationHeader";
import ConsultationPanel from "./ConsultationPanel";
import VideoPanel from "./VideoPanel";

interface ConsultationModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function ConsultationModal({ appointment, onClose }: ConsultationModalProps) {
  if (!appointment) return null;

  return (
    <ConsultationProvider appointment={appointment}>
      <div className="fixed inset-0 bg-text flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-background text-text rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-primary-light/10">
          <ConsultationHeader onClose={onClose} />
          <div className="flex-1 flex overflow-hidden">
            <VideoPanel />
            <div className="p-6 flex-1">
              <ConsultationPanel />
            </div>

          </div>
        </div>
      </div>
    </ConsultationProvider>
  );
}