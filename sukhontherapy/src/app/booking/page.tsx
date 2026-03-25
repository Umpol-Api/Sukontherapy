"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Check, ChevronRight, Calendar, Clock, User, CreditCard, ArrowLeft, ArrowRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { formatPrice, formatTime } from "@/lib/utils";

type Service = { id: string; name: string; description: string; durations: string };
type Staff = { id: string; name: string; bio: string | null };
type Slot = { time: string; staff: { id: string; name: string }[] };
type Duration = { mins: number; price: number };

const STEPS = ["Service", "Date & Time", "Confirm"];

function BookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();
    const [step, setStep] = useState(0);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDuration, setSelectedDuration] = useState<Duration | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [slots, setSlots] = useState<Slot[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    const [selectedStaffId, setSelectedStaffId] = useState<string>("auto");
    const [loading, setLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const preSelectedId = searchParams.get("service");

    useEffect(() => {
        fetch("/api/services").then(r => r.json()).then(data => {
            setServices(data);
            if (preSelectedId) {
                const svc = data.find((s: Service) => s.id === preSelectedId);
                if (svc) {
                    setSelectedService(svc);
                    const dur = JSON.parse(svc.durations)[0];
                    setSelectedDuration(dur);
                }
            }
        });
    }, [preSelectedId]);

    useEffect(() => {
        if (!selectedDate || !selectedDuration || !selectedService) return;
        setSlotsLoading(true);
        const d = selectedDate.toISOString().slice(0, 10);
        fetch(`/api/availability?serviceId=${selectedService.id}&date=${d}&duration=${selectedDuration.mins}`)
            .then(r => r.json())
            .then(data => { setSlots(data.slots || []); setSlotsLoading(false); });
    }, [selectedDate, selectedDuration, selectedService]);

    const handleBook = async () => {
        if (!session?.user) { router.push("/login"); return; }
        if (!selectedService || !selectedDuration || !selectedDate || !selectedSlot) return;

        setLoading(true);
        const [h, m] = selectedSlot.time.split(":").map(Number);
        const dt = new Date(selectedDate);
        dt.setHours(h, m, 0, 0);

        const chosenStaff = selectedStaffId === "auto" ? null : selectedStaffId;

        const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                serviceId: selectedService.id,
                staffId: chosenStaff,
                datetime: dt.toISOString(),
                durationMins: selectedDuration.mins,
            }),
        });
        const data = await res.json();
        setLoading(false);
        if (res.ok) {
            router.push(`/payment/${data.id}`);
        }
    };

    const canProceedStep0 = selectedService && selectedDuration;
    const canProceedStep1 = selectedDate && selectedSlot;

    return (
        <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)", padding: "7rem 1.5rem 4rem" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto" }}>
                {/* Steps indicator */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "3rem", gap: "0" }}>
                    {STEPS.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem" }}>
                                <div style={{
                                    width: "36px", height: "36px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    background: i < step ? "var(--gold)" : i === step ? "var(--brown)" : "transparent",
                                    border: i > step ? "1px solid rgba(59,35,20,0.2)" : "none",
                                    color: i < step ? "var(--brown)" : i === step ? "var(--gold-light)" : "var(--muted)",
                                    fontSize: "0.85rem", fontWeight: "600",
                                    transition: "all 0.3s ease",
                                }}>
                                    {i < step ? <Check size={15} /> : i + 1}
                                </div>
                                <span style={{ fontSize: "0.7rem", fontFamily: "Inter", letterSpacing: "0.08em", textTransform: "uppercase", color: i === step ? "var(--brown)" : "var(--muted)" }}>{s}</span>
                            </div>
                            {i < STEPS.length - 1 && (
                                <div style={{ width: "80px", height: "1px", background: i < step ? "var(--gold)" : "rgba(59,35,20,0.15)", margin: "0 0.75rem", marginBottom: "1.2rem", transition: "background 0.3s ease" }} />
                            )}
                        </div>
                    ))}
                </div>

                <div style={{ background: "var(--white)", border: "1px solid rgba(201,168,76,0.18)", padding: "2.5rem" }}>
                    {/* Step 0: Service Selection */}
                    {step === 0 && (
                        <div>
                            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--brown)", marginBottom: "0.5rem" }}>Choose Your Treatment</h2>
                            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>Select a service and preferred session duration.</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                {services.map((svc) => {
                                    const durations: Duration[] = JSON.parse(svc.durations);
                                    const isSelected = selectedService?.id === svc.id;
                                    return (
                                        <div key={svc.id}
                                            onClick={() => { setSelectedService(svc); setSelectedDuration(durations[0]); }}
                                            style={{ padding: "1.25rem 1.5rem", border: `1px solid ${isSelected ? "var(--gold)" : "rgba(59,35,20,0.15)"}`, background: isSelected ? "rgba(201,168,76,0.05)" : "transparent", cursor: "pointer", transition: "all 0.25s ease" }}>
                                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                                <div>
                                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "var(--brown)", marginBottom: "0.25rem" }}>{svc.name}</div>
                                                    <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>{svc.description.slice(0, 80)}...</p>
                                                </div>
                                                {isSelected && <Check size={16} color="var(--gold)" />}
                                            </div>

                                            {isSelected && (
                                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem", flexWrap: "wrap" }}>
                                                    {durations.map((d) => (
                                                        <button key={d.mins} onClick={(e) => { e.stopPropagation(); setSelectedDuration(d); }}
                                                            style={{ padding: "0.4rem 0.85rem", border: `1px solid ${selectedDuration?.mins === d.mins ? "var(--gold)" : "rgba(59,35,20,0.2)"}`, background: selectedDuration?.mins === d.mins ? "var(--gold)" : "transparent", color: selectedDuration?.mins === d.mins ? "var(--brown)" : "var(--muted)", fontSize: "0.78rem", cursor: "pointer", transition: "all 0.2s ease" }}>
                                                            {d.mins} min — ฿{d.price.toLocaleString()}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Step 1: Date & Time */}
                    {step === 1 && (
                        <div>
                            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--brown)", marginBottom: "0.5rem" }}>Select Date &amp; Time</h2>
                            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>Choose your preferred date and available time slot.</p>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                                <div>
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={(d) => { setSelectedDate(d); setSelectedSlot(null); }}
                                        disabled={{ before: new Date() }}
                                        modifiersStyles={{ selected: { background: "var(--brown)", color: "var(--gold-light)", borderRadius: "50%" }, today: { border: "1px solid var(--gold)", borderRadius: "50%", color: "var(--gold)" } }}
                                    />
                                </div>

                                <div>
                                    {selectedDate ? (
                                        <div>
                                            <p style={{ fontFamily: "Inter", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.75rem" }}>Available Slots</p>
                                            {slotsLoading ? (
                                                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Loading...</p>
                                            ) : slots.length === 0 ? (
                                                <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>No slots available on this date.</p>
                                            ) : (
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                                                    {slots.map((slot) => (
                                                        <button key={slot.time} onClick={() => { setSelectedSlot(slot); setSelectedStaffId("auto"); }}
                                                            style={{ padding: "0.6rem", border: `1px solid ${selectedSlot?.time === slot.time ? "var(--gold)" : "rgba(59,35,20,0.15)"}`, background: selectedSlot?.time === slot.time ? "var(--gold)" : "transparent", color: selectedSlot?.time === slot.time ? "var(--brown)" : "var(--brown)", fontSize: "0.82rem", cursor: "pointer", fontWeight: selectedSlot?.time === slot.time ? "600" : "400", transition: "all 0.2s ease" }}>
                                                            {formatTime(slot.time)}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {selectedSlot && (
                                                <div style={{ marginTop: "1.25rem" }}>
                                                    <p style={{ fontFamily: "Inter", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.5rem" }}>Therapist</p>
                                                    <select className="spa-input" value={selectedStaffId} onChange={(e) => setSelectedStaffId(e.target.value)} style={{ fontSize: "0.85rem" }}>
                                                        <option value="auto">Auto-assign (any available)</option>
                                                        {selectedSlot.staff.map((s) => (
                                                            <option key={s.id} value={s.id}>{s.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--muted)", fontSize: "0.85rem" }}>
                                            <Calendar size={32} style={{ opacity: 0.3, marginRight: "0.5rem" }} />
                                            Select a date first
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Confirm */}
                    {step === 2 && (
                        <div>
                            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--brown)", marginBottom: "0.5rem" }}>Confirm Your Booking</h2>
                            <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginBottom: "2rem" }}>Please review your details before proceeding to payment.</p>

                            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                                {[
                                    { icon: <User size={16} />, label: "Service", value: `${selectedService?.name} (${selectedDuration?.mins} min)` },
                                    { icon: <Calendar size={16} />, label: "Date", value: selectedDate?.toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) || "" },
                                    { icon: <Clock size={16} />, label: "Time", value: selectedSlot ? formatTime(selectedSlot.time) : "" },
                                    { icon: <CreditCard size={16} />, label: "Price", value: formatPrice(selectedDuration?.price || 0) },
                                ].map((row, i) => (
                                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 0", borderBottom: i < 3 ? "1px solid rgba(201,168,76,0.12)" : "none" }}>
                                        <div style={{ color: "var(--gold)", flexShrink: 0, width: "24px" }}>{row.icon}</div>
                                        <div style={{ fontSize: "0.78rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", width: "80px", flexShrink: 0 }}>{row.label}</div>
                                        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "var(--brown)" }}>{row.value}</div>
                                    </div>
                                ))}
                            </div>

                            {!session?.user && (
                                <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)", fontSize: "0.85rem", color: "var(--brown)" }}>
                                    You need to <a href="/login" style={{ color: "var(--gold)", fontWeight: "600" }}>sign in</a> or <a href="/register" style={{ color: "var(--gold)", fontWeight: "600" }}>create an account</a> to complete your booking.
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation */}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                        <button onClick={() => setStep(Math.max(0, step - 1))} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "none", border: "1px solid rgba(59,35,20,0.2)", padding: "0.7rem 1.25rem", color: "var(--muted)", cursor: "pointer", fontSize: "0.82rem", visibility: step === 0 ? "hidden" : "visible" }}>
                            <ArrowLeft size={14} /> Back
                        </button>

                        {step < STEPS.length - 1 ? (
                            <button onClick={() => setStep(step + 1)}
                                disabled={(step === 0 && !canProceedStep0) || (step === 1 && !canProceedStep1)}
                                className="btn-primary"
                                style={{ opacity: ((step === 0 && !canProceedStep0) || (step === 1 && !canProceedStep1)) ? 0.4 : 1, cursor: ((step === 0 && !canProceedStep0) || (step === 1 && !canProceedStep1)) ? "not-allowed" : "pointer" }}>
                                <span>Continue</span>
                                <ArrowRight size={13} style={{ position: "relative", zIndex: 1 }} />
                            </button>
                        ) : (
                            <button onClick={handleBook} disabled={loading || !session?.user} className="btn-primary" style={{ opacity: loading || !session?.user ? 0.7 : 1 }}>
                                <span>{loading ? "Processing..." : "Proceed to Payment"}</span>
                                <ChevronRight size={13} style={{ position: "relative", zIndex: 1 }} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense>
            <BookingContent />
        </Suspense>
    );
}
