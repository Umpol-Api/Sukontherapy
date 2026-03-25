import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Clock, Package, User, ArrowRight, CheckCircle, XCircle, AlertCircle, Star } from "lucide-react";
import { formatPrice, formatDate, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_ICON: Record<string, React.ReactNode> = {
  CONFIRMED: <CheckCircle size={14} color="#16a34a" />,
  CANCELLED: <XCircle size={14} color="#dc2626" />,
  PENDING_PAYMENT: <AlertCircle size={14} color="#d97706" />,
  AWAITING_CONFIRMATION: <Clock size={14} color="#2563eb" />,
  COMPLETED: <Star size={14} color="var(--gold)" />,
};

const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  PENDING_PAYMENT: "Pending Payment",
  AWAITING_CONFIRMATION: "Awaiting Confirmation",
  COMPLETED: "Completed",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = (session.user as any).id;

  const [bookings, coupons, user] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      include: { service: true, staff: true },
      orderBy: { datetime: "desc" },
    }),
    prisma.couponPackage.findMany({
      where: { userId, isActive: true },
      include: { service: true },
    }),
    prisma.user.findUnique({ where: { id: userId } }),
  ]);

  const now = new Date();
  const upcoming = bookings.filter(
    (b) => new Date(b.datetime) > now && !["CANCELLED", "COMPLETED"].includes(b.status)
  );
  const past = bookings.filter(
    (b) => new Date(b.datetime) <= now || ["COMPLETED", "CANCELLED"].includes(b.status)
  );

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Header */}
      <section style={{ padding: "4rem 1.5rem 2.5rem", background: "linear-gradient(160deg, var(--brown) 0%, var(--brown-light) 100%)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
            <div style={{ width: "52px", height: "52px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <User size={22} color="var(--gold)" />
            </div>
            <div>
              <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--white)", fontWeight: "400" }}>
                Welcome, {user?.name?.split(" ")[0]}
              </h1>
              <p style={{ color: "rgba(245,239,230,0.55)", fontSize: "0.8rem" }}>{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {[
            { label: "Total Bookings", value: bookings.length, icon: <Calendar size={18} /> },
            { label: "Upcoming", value: upcoming.length, icon: <Clock size={18} /> },
            { label: "Active Packages", value: coupons.filter(c => c.usedSessions < c.totalSessions).length, icon: <Package size={18} /> },
          ].map((stat, i) => (
            <div key={i} style={{ background: "var(--white)", padding: "1.5rem", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "42px", height: "42px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", color: "var(--brown)", lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{stat.label}</div>
              </div>
            </div>
          ))}
          <Link href="/booking" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", textDecoration: "none" }}>
            <span>Book New Session</span>
            <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem", alignItems: "start" }}>
          {/* Bookings */}
          <div>
            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div style={{ marginBottom: "2.5rem" }}>
                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--brown)", marginBottom: "1rem" }}>Upcoming Sessions</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {upcoming.map((b) => (
                    <div key={b.id} style={{ background: "var(--white)", padding: "1.25rem 1.5rem", border: "1px solid rgba(201,168,76,0.2)", borderLeft: "3px solid var(--gold)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.15rem", color: "var(--brown)", marginBottom: "0.25rem" }}>{b.service.name}</h3>
                          <p style={{ color: "var(--muted)", fontSize: "0.8rem" }}>
                            {formatDate(b.datetime)} · {formatTime(new Date(b.datetime).toTimeString().slice(0, 5))} · {b.durationMins} min
                          </p>
                          {b.staff && <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "0.15rem" }}>with {b.staff.name}</p>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                            {STATUS_ICON[b.status]}
                            {STATUS_LABEL[b.status]}
                          </div>
                          <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--gold)" }}>{formatPrice(b.price)}</span>
                          {b.status === "PENDING_PAYMENT" && (
                            <Link href={`/payment/${b.id}`} style={{ fontSize: "0.72rem", color: "var(--gold)", textDecoration: "underline" }}>
                              Pay Now
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Past bookings */}
            <div>
              <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--brown)", marginBottom: "1rem" }}>Past Bookings</h2>
              {past.length === 0 ? (
                <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>No past bookings yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {past.slice(0, 8).map((b) => (
                    <div key={b.id} style={{ background: "var(--white)", padding: "1rem 1.5rem", border: "1px solid rgba(59,35,20,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--brown)" }}>{b.service.name}</span>
                        <span style={{ color: "var(--muted)", fontSize: "0.78rem", marginLeft: "0.75rem" }}>
                          {new Date(b.datetime).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontSize: "0.75rem", color: "var(--muted)" }}>
                          {STATUS_ICON[b.status]}
                          {STATUS_LABEL[b.status]}
                        </div>
                        <Link href={`/booking?service=${b.serviceId}`} style={{ fontSize: "0.72rem", color: "var(--gold)", textDecoration: "none", border: "1px solid rgba(201,168,76,0.3)", padding: "0.25rem 0.65rem" }}>
                          Rebook
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Coupon packages sidebar */}
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--brown)", marginBottom: "1rem" }}>Session Packages</h2>
            {coupons.length === 0 ? (
              <div style={{ background: "var(--white)", padding: "1.5rem", border: "1px solid rgba(201,168,76,0.15)", textAlign: "center" }}>
                <Package size={32} color="var(--gold)" style={{ marginBottom: "0.75rem", opacity: 0.5 }} />
                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  No packages yet. Purchase a 4-session package for exclusive savings.
                </p>
                <Link href="/services" style={{ display: "inline-block", marginTop: "1rem", color: "var(--gold)", fontSize: "0.8rem", textDecoration: "underline" }}>
                  Browse Services
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {coupons.map((c) => {
                  const remaining = c.totalSessions - c.usedSessions;
                  const pct = (c.usedSessions / c.totalSessions) * 100;
                  return (
                    <div key={c.id} style={{ background: "var(--white)", padding: "1.25rem", border: "1px solid rgba(201,168,76,0.2)" }}>
                      <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--brown)", marginBottom: "0.25rem" }}>{c.service.name}</h3>
                      <p style={{ color: "var(--gold)", fontSize: "0.9rem", fontWeight: "600", marginBottom: "0.75rem" }}>
                        {remaining} / {c.totalSessions} sessions remaining
                      </p>
                      {/* Progress bar */}
                      <div style={{ height: "4px", background: "rgba(59,35,20,0.1)", borderRadius: "2px", overflow: "hidden", marginBottom: "0.5rem" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: "var(--gold)", transition: "width 0.5s ease" }} />
                      </div>
                      <p style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
                        Expires: {new Date(c.expiresAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
