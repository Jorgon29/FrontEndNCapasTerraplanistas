import type { Appointment } from "../utils/Appointment";

interface VideoCallModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export default function VideoCallModal({
  appointment,
  onClose,
}: VideoCallModalProps) {
  if (!appointment) return null;

  return (
    <div
      className="
        fixed
        inset-0
        bg-black/60
        flex
        items-center
        justify-center
        z-50
      "
    >
      <div
        className="
          bg-white
          rounded-2xl
          w-175
          p-6
        "
      >
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">
            Videollamada
          </h2>

          <button
            onClick={onClose}
            className="text-red-500"
          >
            Terminar llamada
          </button>
        </div>

        <div
          className="
            mt-6
            bg-gray-900
            rounded-2xl
            h-100
            flex
            items-center
            justify-center
            text-white
            text-3xl
          "
        >
          Videollamada simulada
        </div>

        <div className="mt-4">
          <p>
            Enlace de reunión
          </p>

          <a
            href={
              appointment.meeting_link
            }
            className="text-primary"
          >
            {appointment.meeting_link}
          </a>
        </div>
      </div>
    </div>
  );
}