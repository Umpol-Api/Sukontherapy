import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowLeft } from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  CONFIRMED: { color: "#16a34a", bg: "rgba(22,163,74,0.1)", label: "Confirmed", icon: <CheckCircle size={12} /> },
  PENDING_PAYMENT: { color: "#d97706", bg: "rgba(245,158,11,0.1)", label: "Pending Payment", icon: <AlertCircle size={12} /> },
  AWAITING_CONFIRMATION: { color: "#2563eb", bg: "rgba(37,99,235,0.1)", label: "Awaiting", icon: <Clock size={12} /> },
  CANCELLED: { color: "#dc2626", bg: "rgba(239,68,68,0.1)", label: "Cancelled", icon: <XCircle size={12} /> },
  COMPLETED: { color: "var(--gold)", bg: "rgba(201,168,76,0.1)", label: "Completed", icon: <CheckCircle size={12} /> },
};

export default async function AdminBookingsPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const bookings = await prisma.booking.findMany({
    include: { service: true, staff: true, user: { select: { name: true, email: true, phone: true } } },
    orderBy: { datetime: "desc" },
    take: 100,
  });

  const grouped: Record<string, typeof bookings> = {};
  for (const b of bookings) {
    const dateKey = new Date(b.datetime).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(b);
  }

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--charcoal)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem" }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--gold-light)", fontWeight: "400" }}>All Bookings</h1>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {Object.entries(grouped).map(([date, dayBookings]) => (
          <div key={date} style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", color: "var(--brown)", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
              {date}
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--white)", fontSize: "0.875rem" }}>
                <thead>
                  <tr style={{ background: "rgba(59,35,20,0.04)" }}>
                    {["Time", "Customer", "Service", "Duration", "Therapist", "Amount", "Status"].map(h => (
                      <th key={h} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: "500", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dayBookings.map((b) => {
                    const s = STATUS_COLORS[b.status] ?? STATUS_COLORS.PENDING_PAYMENT;
                    return (
                      <tr key={b.id} style={{ borderBottom: "1px solid rgba(59,35,20,0.06)" }}>
                        <td style={{ padding: "0.875rem 1rem", fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--gold)", fontWeight: "600" }}>
                          {formatTime(new Date(b.datetime).toTimeString().slice(0, 5))}
                        </td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <div style={{ color: "var(--brown)", fontWeight: "500" }}>{b.user.name}</div>
                          <div style={{ color: "var(--muted)", fontSize: "0.75rem" }}>{b.user.email}</div>
                        </td>
                        <td style={{ padding: "0.875rem 1rem", color: "var(--brown)" }}>{b.service.name}</td>
                        <td style={{ padding: "0.875rem 1rem", color: "var(--muted)" }}>{b.durationMins} min</td>
                        <td style={{ padding: "0.875rem 1rem", color: "var(--muted)" }}>{b.staff?.name ?? "—"}</td>
                        <td style={{ padding: "0.875rem 1rem", fontFamily: "Cormorant Garamond, serif", color: "var(--gold)" }}>{formatPrice(b.price)}</td>
                        <td style={{ padding: "0.875rem 1rem" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", padding: "0.3rem 0.65rem", background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: "600", letterSpacing: "0.05em" }}>
                            {s.icon} {s.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>No bookings found.</div>
        )}
      </div>
    </div>
  );
}
