import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Users, Layers, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [todayBookings, allBookings, totalUsers, services, staff] = await Promise.all([
    prisma.booking.findMany({
      where: { datetime: { gte: today, lt: tomorrow }, status: { not: "CANCELLED" } },
      include: { service: true, staff: true, user: { select: { name: true, email: true } } },
      orderBy: { datetime: "asc" },
    }),
    prisma.booking.findMany({
      where: { status: { not: "CANCELLED" } },
      select: { price: true, status: true, createdAt: true },
    }),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.service.count({ where: { isActive: true } }),
    prisma.staff.count({ where: { isActive: true } }),
  ]);

  const todayRevenue = todayBookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED").reduce((sum, b) => sum + b.price, 0);
  const totalRevenue = allBookings.filter(b => b.status === "CONFIRMED" || b.status === "COMPLETED").reduce((sum, b) => sum + b.price, 0);
  const pendingCount = allBookings.filter(b => b.status === "PENDING_PAYMENT" || b.status === "AWAITING_CONFIRMATION").length;

  const stats = [
    { label: "Today's Revenue", value: formatPrice(todayRevenue), icon: <DollarSign size={20} />, sub: `${todayBookings.length} bookings today` },
    { label: "Total Revenue", value: formatPrice(totalRevenue), icon: <TrendingUp size={20} />, sub: `${allBookings.length} confirmed bookings` },
    { label: "Total Customers", value: totalUsers, icon: <Users size={20} />, sub: "registered accounts" },
    { label: "Pending Payments", value: pendingCount, icon: <Clock size={20} />, sub: "need attention", alert: pendingCount > 0 },
  ];

  const navItems = [
    { href: "/admin", label: "Overview", icon: <TrendingUp size={16} /> },
    { href: "/admin/bookings", label: "Bookings", icon: <Calendar size={16} /> },
    { href: "/admin/staff", label: "Staff", icon: <Users size={16} /> },
    { href: "/admin/services", label: "Services", icon: <Layers size={16} /> },
    { href: "/admin/customers", label: "Customers", icon: <Users size={16} /> },
  ];

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      {/* Admin header */}
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--charcoal)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--gold-light)", fontWeight: "400" }}>Admin Dashboard</h1>
            <p style={{ color: "rgba(245,239,230,0.4)", fontSize: "0.8rem" }}>Sukhontherapy Massage & Spa</p>
          </div>
          <nav style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.5rem 1rem", color: "rgba(201,168,76,0.8)", fontSize: "0.78rem", letterSpacing: "0.08em", textDecoration: "none", border: "1px solid rgba(201,168,76,0.2)", transition: "all 0.2s ease" }}>
                {item.icon} {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: "var(--white)", padding: "1.5rem", border: `1px solid ${s.alert ? "rgba(239,68,68,0.25)" : "rgba(201,168,76,0.15)"}`, position: "relative" }}>
              {s.alert && <div style={{ position: "absolute", top: "0.75rem", right: "0.75rem", width: "8px", height: "8px", borderRadius: "50%", background: "#dc2626" }} />}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
                <div style={{ width: "42px", height: "42px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)", flexShrink: 0 }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--brown)", lineHeight: 1.1 }}>{s.value}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: "0.2rem" }}>{s.label}</div>
                  <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: "0.2rem" }}>{s.sub}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's schedule */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--brown)", marginBottom: "1rem" }}>
              Today&apos;s Schedule
              <span style={{ fontSize: "0.85rem", color: "var(--muted)", marginLeft: "0.75rem", fontFamily: "Inter", fontWeight: "400" }}>
                {today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
              </span>
            </h2>
            {todayBookings.length === 0 ? (
              <div style={{ background: "var(--white)", padding: "2rem", border: "1px solid rgba(201,168,76,0.15)", textAlign: "center", color: "var(--muted)", fontSize: "0.875rem" }}>
                No bookings scheduled for today.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                {todayBookings.map((b) => (
                  <div key={b.id} style={{ background: "var(--white)", padding: "1rem 1.25rem", border: "1px solid rgba(201,168,76,0.15)", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ textAlign: "center", minWidth: "48px" }}>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--gold)", fontWeight: "600" }}>
                        {new Date(b.datetime).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--brown)" }}>{b.service.name}</div>
                      <div style={{ fontSize: "0.78rem", color: "var(--muted)" }}>
                        {b.user.name} · {b.durationMins} min
                        {b.staff && ` · ${b.staff.name}`}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.75rem" }}>
                      {b.status === "CONFIRMED" ? <CheckCircle size={13} color="#16a34a" /> : <Clock size={13} color="#d97706" />}
                      <span style={{ color: b.status === "CONFIRMED" ? "#16a34a" : "#d97706" }}>
                        {b.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                      </span>
                    </div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "0.95rem", color: "var(--gold)" }}>
                      {formatPrice(b.price)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick stats panel */}
          <div>
            <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--brown)", marginBottom: "1rem" }}>Quick Overview</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Active Services", value: services, href: "/admin/services", icon: <Layers size={16} /> },
                { label: "Active Staff", value: staff, href: "/admin/staff", icon: <Users size={16} /> },
                { label: "Registered Customers", value: totalUsers, href: "/admin/customers", icon: <Users size={16} /> },
              ].map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1rem", background: "var(--white)", padding: "1rem 1.25rem", border: "1px solid rgba(201,168,76,0.15)", transition: "all 0.25s ease" }}>
                  <div style={{ width: "36px", height: "36px", background: "rgba(201,168,76,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold)" }}>
                    {item.icon}
                  </div>
                  <span style={{ flex: 1, fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "var(--brown)" }}>{item.label}</span>
                  <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.5rem", color: "var(--gold)" }}>{item.value}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
