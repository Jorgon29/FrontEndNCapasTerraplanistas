import { createContext, useContext, useMemo, useState, type ReactElement } from "react";
import type { Appointment } from "@/features/utils/Appointment";

interface ConsultationContextValue {
    appointment: Appointment | null;
    setAppointment: React.Dispatch<React.SetStateAction<Appointment | null>>;
    activeTab: "record" | "prescription";
    setActiveTab: React.Dispatch<React.SetStateAction<"record" | "prescription">>;
    message: { type: "success" | "error"; text: string } | null;
    setMessage: React.Dispatch<React.SetStateAction<{ type: "success" | "error"; text: string } | null>>;
}

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function useConsultation(): ConsultationContextValue {
    const ctx = useContext(ConsultationContext);
    if (!ctx) throw new Error("useConsultation must be used inside <ConsultationProvider>");
    return ctx;
}

interface ConsultationProviderProps {
    children: ReactElement,
    appointment: Appointment
}

export function ConsultationProvider({ children, appointment: prop_appointment }: ConsultationProviderProps) {
    const [appointment, setAppointment] = useState<Appointment | null>(prop_appointment);
    const [activeTab, setActiveTab] = useState<"record" | "prescription">("record");
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const contextValue = useMemo(
        () => ({ appointment, setAppointment, activeTab, setActiveTab, message, setMessage, submitting, setSubmitting }),
        [appointment, activeTab, message]
    );

    return (
        <ConsultationContext.Provider value={contextValue}>
            {children}
        </ConsultationContext.Provider>
    );
}