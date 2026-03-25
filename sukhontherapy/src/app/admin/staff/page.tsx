import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const staff = await prisma.staff.findMany({ orderBy: { name: "asc" } });
  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--charcoal)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link href="/admin" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem" }}>
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--gold-light)", fontWeight: "400" }}>Staff Management</h1>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
          {staff.map((s) => {
            const workDays: number[] = JSON.parse(s.workDays);
            return (
              <div key={s.id} style={{ background: "var(--white)", padding: "1.75rem", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div style={{ display: "flex", align: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                  <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, var(--brown), var(--brown-light))", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-light)", fontSize: "1.25rem", fontFamily: "Cormorant Garamond, serif", flexShrink: 0 }}>
                    {s.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", color: "var(--brown)" }}>{s.name}</h3>
                    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", background: s.isActive ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)", color: s.isActive ? "#16a34a" : "#dc2626", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.06em", marginTop: "0.2rem" }}>
                      {s.isActive ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>
                </div>

                {s.bio && <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>{s.bio}</p>}

                {/* Hours */}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderTop: "1px solid rgba(201,168,76,0.12)", borderBottom: "1px solid rgba(201,168,76,0.12)", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.78rem", color: "var(--muted)" }}>Working Hours</span>
                  <span style={{ fontSize: "0.85rem", color: "var(--brown)", fontWeight: "500" }}>{s.startTime} – {s.endTime}</span>
                </div>

                {/* Work days */}
                <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                  {DAY_NAMES.map((day, idx) => (
                    <span key={day} style={{ padding: "0.25rem 0.5rem", fontSize: "0.7rem", fontWeight: "600", letterSpacing: "0.05em", background: workDays.includes(idx) ? "var(--gold)" : "rgba(59,35,20,0.06)", color: workDays.includes(idx) ? "var(--brown)" : "var(--muted)" }}>
                      {day}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {staff.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>No staff members found.</div>
        )}
      </div>
    </div>
  );
}
