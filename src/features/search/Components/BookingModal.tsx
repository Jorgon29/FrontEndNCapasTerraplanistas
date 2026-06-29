import { useState, useMemo } from "react";
import { Calendar, dateFnsLocalizer, Views, type View } from "react-big-calendar";
import {
    format,
    parse,
    startOfWeek,
    getDay,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    subDays,
    addDays
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLightbulb, faSpinner, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/features/auth/providers/AuthProvider";
import { useAvailableSlots } from "../hooks/useAvailableSlots";
import {
    useCreateTransaction,
    useDeleteAppointment,
    useConfirmPayment,
    StripeProvider,
    PaymentForm,
    PaymentSuccess,
} from "@/features/payment";
import type { PublicDoctor, PublicSpecialty } from "../hooks/usePatientDoctors";
import type { Appointment } from "@/features/utils/Appointment";
import type { TransactionResponse } from "@/features/payment/types/payment";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface BookingModalProps {
    doctor: PublicDoctor;
    appointments: Appointment[];
    onBook: (appointment: any) => void;
    onClose: () => void;
}

type Step = "details" | "payment";

function BookingModal({ doctor, appointments, onBook, onClose }: BookingModalProps) {
    const { patient } = useAuth();

    const [currentView, setCurrentView] = useState<View>(Views.WEEK);
    const [currentDate, setCurrentDate] = useState(new Date());

    const [step, setStep] = useState<Step>("details");
    const [selectedSpecialtyId, setSelectedSpecialtyId] = useState(doctor.specialties[0]?.specialtyId || "");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null);
    const [paymentComplete, setPaymentComplete] = useState(false);

    const createTransaction = useCreateTransaction();
    const deleteAppointment = useDeleteAppointment();
    const confirmPayment = useConfirmPayment();

    const selectedSpecialty = useMemo(() =>
        doctor.specialties.find(s => s.specialtyId === selectedSpecialtyId) || doctor.specialties[0],
    [doctor.specialties, selectedSpecialtyId]);

    const visibleRange = useMemo(() => {
        let start = currentDate;
        let end = currentDate;

        if (currentView === Views.MONTH) {
            start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
            end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
        } else if (currentView === Views.WEEK) {
            start = startOfWeek(currentDate, { weekStartsOn: 0 });
            end = endOfWeek(currentDate, { weekStartsOn: 0 });
        }

        return { start: subDays(start, 7), end: addDays(end, 7) };
    }, [currentDate, currentView]);

    const { slots, isLoading } = useAvailableSlots(
        doctor.id,
        selectedSpecialty?.code,
        visibleRange.start,
        visibleRange.end,
        selectedSpecialty?.consultDurationMinutes
    );

    const combinedEvents = useMemo(() => {
        const busyEvents = appointments.map((apt) => ({
            title: "Ocupado",
            start: new Date(apt.expected_at),
            end: new Date(new Date(apt.expected_at).getTime() + 60 * 60 * 1000),
            isAvailableSlot: false,
        }));

        const availableEvents = slots.map(slot => {
            const startStr = `${slot.date}T${slot.startTime}`;
            const endStr = `${slot.date}T${slot.endTime}`;
            return {
                title: "Disponible",
                start: new Date(startStr),
                end: new Date(endStr),
                isAvailableSlot: true,
                slotData: slot
            };
        });

        return [...busyEvents, ...availableEvents];
    }, [appointments, slots]);

    const canProceedToPayment = date && time && selectedSpecialty;

    const handleProceedToPayment = async () => {
        if (!patient?.id || !selectedSpecialty || !canProceedToPayment) return;

        try {
            const response = await createTransaction.mutateAsync({
                appointmentInfo: {
                    googleEventId: "TODO_GOOGLE_EVENT_ID",
                    status: "PENDING_PAYMENT",
                    finalFeePerHour: selectedSpecialty.feePerHour,
                    score: null,
                    review: null,
                    registeredAt: new Date().toISOString(),
                    expectedAt: `${date}T${time}:00Z`,
                    employeeId: doctor.id,
                    patientId: patient.id,
                    patientCallerUserId: patient.userId,
                    specialtyCode: selectedSpecialty.code,
                },
                paymentInfo: {
                    currency: "usd",
                    description: `Cita con Dr. ${doctor.firstName} ${doctor.lastName} - ${selectedSpecialty.name}`,
                },
            });

            setTransactionData(response);
            setStep("payment");
        } catch (error) {
            console.error("Failed to create transaction:", error);
            alert("Error al crear la transacción. Por favor intenta de nuevo.");
        }
    };

    const handlePaymentSuccess = async () => {
        if (!transactionData?.appointment?.id || !transactionData.paymentIntentId) {
            console.error("Missing appointment ID or payment intent ID");
            setPaymentComplete(true);
            return;
        }

        try {
            await confirmPayment.mutateAsync({
                appointmentId: transactionData.appointment.id,
                paymentIntentId: transactionData.paymentIntentId,
            });
            setPaymentComplete(true);
            onBook(transactionData.appointment);
        } catch (error) {
            console.error("Failed to confirm payment:", error);
            alert("El pago fue procesado pero no se pudo confirmar. Contacte a soporte.");
            setPaymentComplete(true);
            onBook(transactionData.appointment);
        }
    };

    const handlePaymentCancel = async () => {
        if (transactionData?.appointment?.id) {
            try {
                await deleteAppointment.mutateAsync(transactionData.appointment.id);
            } catch (error) {
                console.error("Failed to delete appointment:", error);
            }
        }
        setStep("details");
        setTransactionData(null);
    };

    const handleBack = () => {
        if (step === "payment" && transactionData?.appointment?.id) {
            handlePaymentCancel();
        }
        setStep("details");
    };

    const handleClose = () => {
        if (step === "payment" && !paymentComplete && transactionData?.appointment?.id) {
            handlePaymentCancel();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-background text-text rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-surface-alt">

                <div className="flex items-center justify-between px-6 py-4 border-b border-surface-alt">
                    <div className="flex items-center gap-3">
                        {step === "payment" && (
                            <button
                                onClick={handleBack}
                                className="text-text-muted hover:text-text transition-colors cursor-pointer"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
                            </button>
                        )}
                        <div>
                            <h2 className="text-lg font-semibold text-text">
                                {step === "details" ? "Agendar cita" : "Pago"}
                            </h2>
                            <p className="text-xs text-text-muted mt-0.5">
                                {step === "details"
                                    ? `Dr. ${doctor.firstName} ${doctor.lastName}`
                                    : `Cita con Dr. ${doctor.firstName} ${doctor.lastName}`}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClose} className="text-text-muted hover:text-text transition-colors text-xl leading-none cursor-pointer">
                        ✕
                    </button>
                </div>

                {step === "details" && (
                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 p-4 border-r border-surface-alt overflow-auto relative">
                            <div className="flex justify-between items-center mb-3">
                                <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                    Disponibilidad del doctor
                                </p>
                                {isLoading && (
                                    <span className="text-xs text-primary font-medium animate-pulse">
                                        <FontAwesomeIcon icon={faSpinner} spin className="mr-1" /> Actualizando...
                                    </span>
                                )}
                            </div>

                            <div style={{ height: "520px" }}>
                                <Calendar
                                    localizer={localizer}
                                    events={combinedEvents}
                                    startAccessor="start"
                                    endAccessor="end"
                                    toolbar={true}
                                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                                    defaultView={Views.WEEK}
                                    view={currentView}
                                    date={currentDate}
                                    onView={setCurrentView}
                                    onNavigate={setCurrentDate}
                                    popup
                                    selectable
                                    onSelectSlot={(slot) => {
                                        const d = slot.start;
                                        setDate(format(d, "yyyy-MM-dd"));
                                        setTime(format(d, "HH:mm"));
                                    }}
                                    onSelectEvent={(event: any) => {
                                        if (event.isAvailableSlot) {
                                            setDate(format(event.start, "yyyy-MM-dd"));
                                            setTime(format(event.start, "HH:mm"));
                                        }
                                    }}
                                    eventPropGetter={(event: any) => {
                                        if (event.isAvailableSlot) {
                                            return {
                                                style: {
                                                    backgroundColor: "rgba(16, 185, 129, 0.15)",
                                                    borderColor: "#10b981",
                                                    color: "#065f46",
                                                    fontSize: "11px",
                                                    fontWeight: 600,
                                                },
                                            };
                                        }
                                        return {
                                            style: {
                                                backgroundColor: "#dc2626",
                                                borderColor: "#dc2626",
                                                color: "#fff",
                                                fontSize: "11px",
                                            },
                                        };
                                    }}
                                />
                            </div>
                        </div>

                        <div className="w-80 p-6 flex flex-col gap-4 overflow-auto bg-surface/30">
                            <p className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Detalles de la cita
                            </p>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Especialidad</label>
                                    <select
                                        value={selectedSpecialtyId}
                                        onChange={(e) => setSelectedSpecialtyId(e.target.value)}
                                        className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary cursor-pointer"
                                    >
                                        {doctor.specialties.map(spec => (
                                            <option key={spec.specialtyId} value={spec.specialtyId}>
                                                {spec.name} (${spec.feePerHour}/hr)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Fecha</label>
                                    <input required type="date" value={date} onChange={(e) => setDate(e.target.value)}
                                        className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Hora</label>
                                    <input required type="time" value={time} onChange={(e) => setTime(e.target.value)}
                                        className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm text-text focus:outline-none focus:border-primary" />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-text/70">Notas (opcional)</label>
                                    <textarea rows={4} placeholder="Describa el motivo de la consulta..." value={notes} onChange={(e) => setNotes(e.target.value)}
                                        className="w-full bg-surface border border-surface-alt rounded-xl p-2.5 text-sm focus:outline-none focus:border-primary resize-none text-text placeholder-text-muted" />
                                </div>

                                {selectedSpecialty && (
                                    <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-text-muted">Total a pagar</span>
                                            <span className="text-lg font-bold text-primary">
                                                ${selectedSpecialty.feePerHour}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <p className="text-[11px] text-text-muted leading-relaxed mt-2 bg-primary/5 p-3 rounded-lg border border-primary/10">
                                    <FontAwesomeIcon icon={faLightbulb} className="mr-1"/>
                                    Tip: Haga clic en un recuadro verde (Disponible) en el calendario para autocompletar la fecha y hora.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleProceedToPayment}
                                    disabled={!canProceedToPayment || createTransaction.isPending}
                                    className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-dark transition-colors cursor-pointer mt-2 shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {createTransaction.isPending ? (
                                        <>
                                            <FontAwesomeIcon icon={faSpinner} spin />
                                            Procesando...
                                        </>
                                    ) : (
                                        "Continuar al pago"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === "payment" && transactionData && !paymentComplete && (
                    <div className="flex-1 p-6 overflow-auto">
                        <StripeProvider clientSecret={transactionData.clientSecret}>
                            <PaymentForm
                                onSuccess={handlePaymentSuccess}
                                onCancel={handlePaymentCancel}
                                amount={transactionData.paymentAmount}
                                currency={transactionData.paymentStatus === "usd" ? "USD" : transactionData.paymentStatus.toUpperCase()}
                            />
                        </StripeProvider>
                    </div>
                )}

                {step === "payment" && paymentComplete && transactionData && (
                    <div className="flex-1 p-6 overflow-auto">
                        <PaymentSuccess
                            appointmentId={transactionData.appointment.id}
                            amount={transactionData.paymentAmount}
                            currency={transactionData.paymentStatus === "usd" ? "USD" : transactionData.paymentStatus.toUpperCase()}
                            onContinue={onClose}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default BookingModal;