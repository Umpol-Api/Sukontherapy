import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      bookings: { select: { id: true, price: true, status: true } },
      coupons: { select: { id: true, totalSessions: true, usedSessions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ paddingTop: "80px", minHeight: "100vh", background: "var(--cream)" }}>
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--charcoal)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin" style={{ color: "rgba(201,168,76,0.6)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.8rem" }}>
            <ArrowLeft size={14} /> Dashboard
          </Link>
          <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.75rem", color: "var(--gold-light)", fontWeight: "400" }}>
            Customers ({users.length})
          </h1>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--white)", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "rgba(59,35,20,0.04)" }}>
                {["Customer", "Email", "Phone", "Bookings", "Total Spent", "Active Packages", "Joined"].map(h => (
                  <th key={h} style={{ padding: "0.875rem 1rem", textAlign: "left", fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontWeight: "500", borderBottom: "1px solid rgba(201,168,76,0.15)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const confirmedBookings = u.bookings.filter(b => ["CONFIRMED", "COMPLETED"].includes(b.status));
                const totalSpent = confirmedBookings.reduce((sum, b) => sum + b.price, 0);
                const activePackages = u.coupons.filter(c => c.usedSessions < c.totalSessions).length;

                return (
                  <tr key={u.id} style={{ borderBottom: "1px solid rgba(59,35,20,0.06)" }}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "34px", height: "34px", background: "var(--brown)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--gold-light)", fontSize: "0.85rem", fontFamily: "Cormorant Garamond, serif", flexShrink: 0 }}>
                          {u.name[0]}
                        </div>
                        <span style={{ color: "var(--brown)", fontWeight: "500" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", color: "var(--muted)" }}>{u.email}</td>
                    <td style={{ padding: "1rem", color: "var(--muted)" }}>{u.phone ?? "—"}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "var(--brown)" }}>{u.bookings.length}</span>
                      <span style={{ color: "var(--muted)", fontSize: "0.75rem", marginLeft: "0.35rem" }}>total</span>
                    </td>
                    <td style={{ padding: "1rem", fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", color: "var(--gold)" }}>
                      ฿{totalSpent.toLocaleString()}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {activePackages > 0 ? (
                        <span style={{ padding: "0.25rem 0.6rem", background: "rgba(22,163,74,0.1)", color: "#16a34a", fontSize: "0.75rem", fontWeight: "600" }}>
                          {activePackages} active
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>None</span>
                      )}
                    </td>
                    <td style={{ padding: "1rem", color: "var(--muted)", fontSize: "0.8rem" }}>
                      {new Date(u.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div style={{ textAlign: "center", padding: "4rem", color: "var(--muted)" }}>No customers found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
