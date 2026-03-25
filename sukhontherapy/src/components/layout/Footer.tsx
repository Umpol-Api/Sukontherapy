"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, Heart, Instagram, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <>
        <footer
            style={{
                background: "var(--brown)",
                color: "var(--cream)",
                padding: "4rem 1.5rem 2rem",
            }}
        >
            <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
                {/* Top grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "3rem",
                        paddingBottom: "3rem",
                        borderBottom: "1px solid rgba(201, 168, 76, 0.2)",
                    }}
                >
                    {/* Brand */}
                    <div>
                        <div
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontSize: "1.75rem",
                                fontWeight: "400",
                                color: "var(--gold-light)",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Sukhontherapy
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.7rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "var(--gold)",
                                marginBottom: "1.25rem",
                            }}
                        >
                            Massage & Spa
                        </div>
                        <p
                            style={{
                                color: "rgba(245, 239, 230, 0.65)",
                                fontSize: "0.85rem",
                                lineHeight: 1.7,
                                marginBottom: "1.5rem",
                            }}
                        >
                            A sanctuary of healing and beauty in the heart of Bangkok. Premium
                            Thai wellness, reimagined for the modern soul.
                        </p>
                        {/* Badges */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    padding: "0.3rem 0.6rem",
                                    background: "rgba(201, 168, 76, 0.12)",
                                    border: "1px solid rgba(201, 168, 76, 0.25)",
                                    borderRadius: "2px",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "var(--gold-light)",
                                }}
                            >
                                🏳️‍🌈 LGBTQ+ Friendly
                            </span>
                            <span
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.35rem",
                                    padding: "0.3rem 0.6rem",
                                    background: "rgba(201, 168, 76, 0.12)",
                                    border: "1px solid rgba(201, 168, 76, 0.25)",
                                    borderRadius: "2px",
                                    fontSize: "0.65rem",
                                    letterSpacing: "0.08em",
                                    textTransform: "uppercase",
                                    color: "var(--gold-light)",
                                }}
                            >
                                ♀ Women-Owned
                            </span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontSize: "1.1rem",
                                fontWeight: "500",
                                color: "var(--gold-light)",
                                marginBottom: "1.25rem",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Explore
                        </h4>
                        <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            {[
                                { href: "/", label: "Home" },
                                { href: "/services", label: "Services" },
                                { href: "/booking", label: "Book a Session" },
                                { href: "/contact", label: "Contact Us" },
                                { href: "/login", label: "Customer Login" },
                            ].map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="footer-link"
                                        style={{
                                            color: "rgba(245, 239, 230, 0.65)",
                                            textDecoration: "none",
                                            fontSize: "0.85rem",
                                            transition: "color 0.3s ease",
                                        }}
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontSize: "1.1rem",
                                fontWeight: "500",
                                color: "var(--gold-light)",
                                marginBottom: "1.25rem",
                                letterSpacing: "0.05em",
                            }}
                        >
                            Visit Us
                        </h4>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
                                <MapPin size={14} color="var(--gold)" style={{ marginTop: "3px", flexShrink: 0 }} />
                                <span style={{ color: "rgba(245, 239, 230, 0.65)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                    TIPCO Tower, 118/1 Rama VI Rd,<br />Phaya Thai, Bangkok 10400
                                </span>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                <Phone size={14} color="var(--gold)" />
                                <a href="tel:0823264549" style={{ color: "rgba(245, 239, 230, 0.65)", fontSize: "0.85rem", textDecoration: "none" }}>
                                    082-326-4549
                                </a>
                            </div>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                                <Clock size={14} color="var(--gold)" />
                                <span style={{ color: "rgba(245, 239, 230, 0.65)", fontSize: "0.85rem" }}>
                                    Daily 10:00 AM – 8:00 PM
                                </span>
                            </div>
                        </div>

                        {/* Social */}
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
                            {[
                                { icon: <Instagram size={16} />, href: "#", label: "Instagram" },
                                { icon: <Facebook size={16} />, href: "#", label: "Facebook" },
                            ].map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "1px solid rgba(201, 168, 76, 0.3)",
                                        color: "var(--gold)",
                                        transition: "all 0.3s ease",
                                        textDecoration: "none",
                                    }}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div
                    style={{
                        paddingTop: "1.75rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "0.75rem",
                    }}
                >
                    <p style={{ color: "rgba(245, 239, 230, 0.4)", fontSize: "0.78rem" }}>
                        © {new Date().getFullYear()} Sukhontherapy Massage & Spa. All rights reserved.
                    </p>
                    <p style={{ color: "rgba(245, 239, 230, 0.4)", fontSize: "0.78rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                        Made with <Heart size={11} color="var(--gold)" fill="var(--gold)" /> in Bangkok
                    </p>
                </div>
            </div>
        </footer>
        <style>{`
          .footer-link:hover { color: var(--gold-light) !important; }
        `}</style>
        </>
    );
}
