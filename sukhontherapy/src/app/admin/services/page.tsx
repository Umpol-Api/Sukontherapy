import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const services = await prisma.service.findMany({ orderBy: { name: "asc" } });

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--charcoal)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem" }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--gold-light)", fontWeight: "400" }}>Services & Pricing</h1>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {services.map((svc) => {
            const durations: { mins: number; price: number }[] = JSON.parse(svc.durations);
            return (
              <div key={svc.id} style={{ background: "var(--white)", padding: "1.75rem", border: "1px solid rgba(201,168,76,0.2)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.2rem", color: "var(--brown)" }}>{svc.name}</h3>
                  <span style={{ padding: "0.2rem 0.6rem", background: svc.isActive ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)", color: svc.isActive ? "#16a34a" : "#dc2626", fontSize: "0.7rem", fontWeight: "600" }}>
                    {svc.isActive ? "ACTIVE" : "INACTIVE"}
                  </span>
                </div>

                <span style={{ display: "inline-block", padding: "0.2rem 0.65rem", background: "rgba(201,168,76,0.1)", color: "var(--gold)", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  {svc.category}
                </span>

                <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.65, marginBottom: "1.25rem" }}>{svc.description}</p>

                <div style={{ borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "1rem" }}>
                  <p style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.6rem" }}>Pricing</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {durations.map((d) => (
                      <div key={d.mins} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", color: "var(--muted)" }}>
                          <Clock size={12} /> {d.mins} min
                        </span>
                        <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.05rem", color: "var(--gold)" }}>{formatPrice(d.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
