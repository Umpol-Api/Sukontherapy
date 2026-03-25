"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, Clock, QrCode, AlertCircle, ArrowRight } from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

type Booking = {
  id: string;
  status: string;
  price: number;
  durationMins: number;
  datetime: string;
  service: { name: string };
  staff: { name: string } | null;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_PAYMENT: { label: "Pending Payment", color: "#d97706", bg: "rgba(245,158,11,0.08)" },
  AWAITING_CONFIRMATION: { label: "Awaiting Confirmation", color: "#2563eb", bg: "rgba(37,99,235,0.08)" },
  CONFIRMED: { label: "Confirmed", color: "#16a34a", bg: "rgba(22,163,74,0.08)" },
  CANCELLED: { label: "Cancelled", color: "#dc2626", bg: "rgba(239,68,68,0.08)" },
  COMPLETED: { label: "Completed", color: "var(--gold)", bg: "rgba(201,168,76,0.08)" },
};

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const fetchBooking = useCallback(async () => {
    const res = await fetch(`/api/bookings/${bookingId}`);
    if (res.ok) {
      const data = await res.json();
      setBooking(data);
      if (data.status === "CONFIRMED") setConfirmed(true);
    }
    setLoading(false);
  }, [bookingId]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  const handleIPaid = async () => {
    setConfirming(true);
    // Mark as awaiting confirmation
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "AWAITING_CONFIRMATION" }),
    });

    // Mock auto-confirm after 4 seconds (simulates webhook)
    setCountdown(4);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c === null || c <= 1) {
          clearInterval(interval);
          return null;
        }
        return c - 1;
      });
    }, 1000);

    setTimeout(async () => {
      await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      setConfirmed(true);
      setConfirming(false);
      setBooking((b) => b ? { ...b, status: "CONFIRMED" } : b);
    }, 4000);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px", background: "var(--cream)" }}>
        <div style={{ color: "var(--muted)", fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem" }}>Loading your booking...</div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: "80px", background: "var(--cream)" }}>
        <div style={{ textAlign: "center" }}>
          <AlertCircle size={48} color="var(--gold)" style={{ marginBottom: "1rem" }} />
          <p style={{ color: "var(--muted)" }}>Booking not found.</p>
        </div>
      </div>
    );
  }

  const status = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.PENDING_PAYMENT;
  const promptPayId = process.env.NEXT_PUBLIC_PROMPTPAY_ID || "0823264549";
  const qrDataUri = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=promptpay:${promptPayId}:${booking.price}`;

  return (
    <div style={{ minHeight: "100vh", paddingTop: "80px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "7rem 1.5rem 4rem" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>

        {confirmed ? (
          /* ── Confirmed State ── */
          <div style={{ background: "var(--white)", border: "1px solid rgba(201,168,76,0.2)", padding: "3rem", textAlign: "center", boxShadow: "0 12px 50px rgba(59,35,20,0.08)" }}>
            <div style={{ width: "72px", height: "72px", background: "rgba(22,163,74,0.1)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
              <CheckCircle size={32} color="#16a34a" />
            </div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.25rem", color: "var(--brown)", marginBottom: "0.5rem" }}>Booking Confirmed!</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.875rem", marginBottom: "2rem", lineHeight: 1.7 }}>
              Your session at Sukhontherapy is confirmed. We look forward to welcoming you.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.5rem", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.15)", marginBottom: "2rem", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--muted)" }}>Service</span>
                <span style={{ color: "var(--brown)", fontWeight: "500" }}>{booking.service.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--muted)" }}>Date</span>
                <span style={{ color: "var(--brown)", fontWeight: "500" }}>{formatDate(booking.datetime)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                <span style={{ color: "var(--muted)" }}>Time</span>
                <span style={{ color: "var(--brown)", fontWeight: "500" }}>
                  {formatTime(new Date(booking.datetime).toTimeString().slice(0, 5))}
                </span>
              </div>
              {booking.staff && (
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem" }}>
                  <span style={{ color: "var(--muted)" }}>Therapist</span>
                  <span style={{ color: "var(--brown)", fontWeight: "500" }}>{booking.staff.name}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.875rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                <span style={{ color: "var(--muted)" }}>Amount Paid</span>
                <span style={{ color: "var(--gold)", fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "600" }}>{formatPrice(booking.price)}</span>
              </div>
            </div>

            <button onClick={() => router.push("/dashboard")} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              <span>View My Bookings</span>
              <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
            </button>
          </div>
        ) : (
          /* ── Payment State ── */
          <div style={{ background: "var(--white)", border: "1px solid rgba(201,168,76,0.2)", padding: "2.5rem", boxShadow: "0 12px 50px rgba(59,35,20,0.08)" }}>

            {/* Status badge */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
              <span style={{ padding: "0.4rem 1rem", background: status.bg, color: status.color, border: `1px solid ${status.color}30`, fontSize: "0.78rem", letterSpacing: "0.08em", fontWeight: "600", textTransform: "uppercase" }}>
                {status.label}
              </span>
            </div>

            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", color: "var(--brown)", textAlign: "center", marginBottom: "0.5rem" }}>Complete Your Payment</h1>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", textAlign: "center", marginBottom: "2rem", lineHeight: 1.65 }}>
              Scan the QR code below with your banking app to pay via PromptPay.
            </p>

            {/* Booking summary */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "1.25rem 1.5rem", background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.13)", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--muted)" }}>{booking.service.name}</span>
                <span style={{ color: "var(--brown)" }}>{booking.durationMins} min</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--muted)" }}>Date & Time</span>
                <span style={{ color: "var(--brown)" }}>{new Date(booking.datetime).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} at {formatTime(new Date(booking.datetime).toTimeString().slice(0, 5))}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "0.5rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>Total</span>
                <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--gold)", fontWeight: "600" }}>{formatPrice(booking.price)}</span>
              </div>
            </div>

            {/* QR Code */}
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ display: "inline-block", padding: "1rem", border: "1px solid rgba(201,168,76,0.25)", background: "white" }}>
                {/* PromptPay QR via image API */}
                <img
                  src={qrDataUri}
                  alt="PromptPay QR Code"
                  width={200}
                  height={200}
                  style={{ display: "block" }}
                />
              </div>
              <p style={{ marginTop: "0.75rem", color: "var(--muted)", fontSize: "0.75rem", letterSpacing: "0.08em" }}>
                PromptPay ID: {promptPayId.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")}
              </p>
            </div>

            {/* Awaiting / Confirm button */}
            {confirming ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                  <Clock size={18} color="var(--gold)" style={{ animation: "spin 1s linear infinite" }} />
                  <span style={{ color: "var(--brown)", fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem" }}>
                    Verifying payment{countdown !== null ? ` (${countdown}s)...` : "..."}
                  </span>
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>Please wait while we confirm your transfer.</p>
              </div>
            ) : (
              <button onClick={handleIPaid} className="btn-primary" style={{ width: "100%", justifyContent: "center" }}>
                <span>I&apos;ve Transferred — Confirm Payment</span>
                <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
              </button>
            )}

            <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.75rem", marginTop: "1rem" }}>
              Paid via cash or LINE? Contact us at 082-326-4549
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
