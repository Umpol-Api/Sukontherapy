import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Clock, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Services & Pricing | Sukhontherapy Massage & Spa",
    description: "Explore our full menu of authentic Thai massages and spa treatments. Choose from Thai massage, aromatherapy, hot stone, couples retreat, and more.",
};

export default async function ServicesPage() {
    const services = await prisma.service.findMany({ where: { isActive: true } });

    const allServices = services.length > 0 ? services : [
        { id: "1", name: "Traditional Thai Massage", description: "Ancient healing technique using acupressure and assisted yoga postures.", category: "massage", durations: JSON.stringify([{ mins: 60, price: 600 }, { mins: 90, price: 850 }, { mins: 120, price: 1100 }]) },
        { id: "2", name: "Aromatherapy Oil Massage", description: "Luxurious full-body massage with premium essential oils.", category: "massage", durations: JSON.stringify([{ mins: 60, price: 700 }, { mins: 90, price: 950 }, { mins: 120, price: 1200 }]) },
        { id: "3", name: "Reflexology Foot Massage", description: "Targeted pressure on reflex points of the feet for whole-body healing.", category: "massage", durations: JSON.stringify([{ mins: 45, price: 400 }, { mins: 60, price: 500 }]) },
        { id: "4", name: "Hot Stone Therapy", description: "Volcanic basalt stones gliding over muscles for deep tension release.", category: "therapy", durations: JSON.stringify([{ mins: 90, price: 1100 }, { mins: 120, price: 1400 }]) },
        { id: "5", name: "Couples Retreat Massage", description: "Synchronized massage for two in our private luxury suite.", category: "specialty", durations: JSON.stringify([{ mins: 60, price: 1400 }, { mins: 90, price: 1900 }]) },
        { id: "6", name: "Herbal Compress Massage", description: "Traditional Thai herbal ball compresses with lemongrass & kaffir lime.", category: "therapy", durations: JSON.stringify([{ mins: 90, price: 950 }, { mins: 120, price: 1250 }]) },
    ];

    const categories = Array.from(new Set(allServices.map(s => s.category)));

    const categoryLabels: Record<string, string> = {
        massage: "Massage Therapies",
        therapy: "Healing Therapies",
        specialty: "Specialty & Couples",
    };

    const icons: Record<string, string> = {
        massage: "✦",
        therapy: "◆",
        specialty: "◈",
    };

    return (
        <div style={{ paddingTop: "80px", background: "var(--cream)", minHeight: "100vh" }}>
            {/* Hero */}
            <section
                style={{
                    padding: "6rem 1.5rem 4rem",
                    background: "linear-gradient(160deg, var(--brown) 0%, var(--brown-light) 100%)",
                    textAlign: "center",
                }}
            >
                <p className="section-label" style={{ marginBottom: "0.75rem", color: "var(--gold)" }}>Our Menu</p>
                <h1
                    style={{
                        fontFamily: "Cormorant Garamond, serif",
                        fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                        fontWeight: "300",
                        color: "var(--white)",
                        marginBottom: "1rem",
                        lineHeight: 1.1,
                    }}
                >
                    Treatments &amp;{" "}
                    <span
                        style={{
                            background: "linear-gradient(135deg, var(--gold), var(--gold-light))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            backgroundClip: "text",
                            fontStyle: "italic",
                        }}
                    >
                        Experiences
                    </span>
                </h1>
                <div className="gold-divider" />
                <p
                    style={{
                        color: "rgba(245,239,230,0.6)",
                        fontFamily: "Inter",
                        fontSize: "0.9rem",
                        marginTop: "1rem",
                        letterSpacing: "0.05em",
                    }}
                >
                    Every treatment crafted to restore your body, calm your mind, and elevate your spirit.
                </p>
            </section>

            {/* Services by category */}
            <section style={{ padding: "5rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
                {categories.map((category) => {
                    const categoryServices = allServices.filter(s => s.category === category);
                    return (
                        <div key={category} style={{ marginBottom: "5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                                <span style={{ fontSize: "1.25rem", color: "var(--gold)" }}>{icons[category] ?? "✦"}</span>
                                <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: "400", color: "var(--brown)" }}>
                                    {categoryLabels[category] ?? category}
                                </h2>
                                <div style={{ flex: 1, height: "1px", background: "linear-gradient(to right, rgba(201,168,76,0.4), transparent)" }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.75rem" }}>
                                {categoryServices.map((svc) => {
                                    const durations: { mins: number; price: number }[] = JSON.parse(svc.durations);
                                    return (
                                        <div key={svc.id} className="spa-card" style={{ padding: "2rem" }}>
                                            <h3
                                                style={{
                                                    fontFamily: "Cormorant Garamond, serif",
                                                    fontSize: "1.4rem",
                                                    fontWeight: "500",
                                                    color: "var(--brown)",
                                                    marginBottom: "0.75rem",
                                                }}
                                            >
                                                {svc.name}
                                            </h3>
                                            <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                                                {svc.description}
                                            </p>

                                            {/* Duration + Price options */}
                                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                                                {durations.map((d) => (
                                                    <span
                                                        key={d.mins}
                                                        style={{
                                                            display: "inline-flex",
                                                            alignItems: "center",
                                                            gap: "0.3rem",
                                                            padding: "0.4rem 0.85rem",
                                                            background: "rgba(201,168,76,0.08)",
                                                            border: "1px solid rgba(201,168,76,0.2)",
                                                            fontSize: "0.78rem",
                                                            color: "var(--brown-light)",
                                                            fontFamily: "Inter",
                                                        }}
                                                    >
                                                        <Clock size={11} />
                                                        {d.mins} min
                                                        <span style={{ color: "var(--gold)", fontWeight: "600", marginLeft: "0.25rem" }}>
                                                            ฿{d.price.toLocaleString()}
                                                        </span>
                                                    </span>
                                                ))}
                                            </div>

                                            <Link
                                                href={`/booking?service=${svc.id}`}
                                                className="btn-primary"
                                                style={{ width: "100%", justifyContent: "center" }}
                                            >
                                                <span>Book This Treatment</span>
                                                <ArrowRight size={13} style={{ position: "relative", zIndex: 1 }} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Package CTA */}
            <section
                style={{
                    padding: "5rem 1.5rem",
                    background: "var(--brown)",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 70%)" }} />
                <div style={{ position: "relative", maxWidth: "600px", margin: "0 auto" }}>
                    <p className="section-label" style={{ marginBottom: "0.75rem" }}>Best Value</p>
                    <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.5rem", fontWeight: "300", color: "var(--white)", marginBottom: "1rem" }}>
                        Session Packages
                    </h2>
                    <div className="gold-divider" />
                    <p style={{ color: "rgba(245,239,230,0.55)", fontSize: "0.9rem", lineHeight: 1.75, marginTop: "1.25rem", marginBottom: "2rem" }}>
                        Purchase a 4-session package for any service and enjoy exclusive savings. Sessions never expire for 6 months and are tracked automatically in your account.
                    </p>
                    <Link href="/register" className="btn-primary">
                        <span>Create Account to Unlock Packages</span>
                        <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
