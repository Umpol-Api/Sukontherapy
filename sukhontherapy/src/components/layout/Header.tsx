"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/booking", label: "Book Now" },
    { href: "/contact", label: "Contact" },
];

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isHome = pathname === "/";

    return (
        <header
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                transition: "all 0.4s ease",
                background: scrolled || !isHome
                    ? "rgba(245, 239, 230, 0.97)"
                    : "transparent",
                backdropFilter: scrolled || !isHome ? "blur(12px)" : "none",
                borderBottom: scrolled || !isHome
                    ? "1px solid rgba(201, 168, 76, 0.2)"
                    : "none",
                boxShadow: scrolled
                    ? "0 4px 30px rgba(59, 35, 20, 0.08)"
                    : "none",
            }}
        >
            <div
                style={{
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 1.5rem",
                    height: scrolled ? "64px" : "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    transition: "height 0.4s ease",
                }}
            >
                {/* Logo */}
                <Link
                    href="/"
                    style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem" }}
                >
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            background: "linear-gradient(135deg, var(--brown), var(--brown-light))",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: "2px",
                        }}
                    >
                        <Sparkles size={18} color="var(--gold-light)" />
                    </div>
                    <div>
                        <div
                            style={{
                                fontFamily: "Cormorant Garamond, serif",
                                fontSize: "1.25rem",
                                fontWeight: "600",
                                color: "var(--brown)",
                                lineHeight: 1,
                                letterSpacing: "0.02em",
                            }}
                        >
                            Sukhontherapy
                        </div>
                        <div
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.6rem",
                                letterSpacing: "0.2em",
                                textTransform: "uppercase",
                                color: "var(--gold)",
                            }}
                        >
                            Massage & Spa
                        </div>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden-mobile">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.8rem",
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: pathname === link.href ? "var(--gold)" : "var(--brown)",
                                fontWeight: pathname === link.href ? "600" : "400",
                                transition: "color 0.3s ease",
                                borderBottom: pathname === link.href ? "1px solid var(--gold)" : "1px solid transparent",
                                paddingBottom: "2px",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                {/* Auth */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }} className="hidden-mobile">
                    {session ? (
                        <>
                            {(session.user as any)?.role === "ADMIN" && (
                                <Link href="/admin" className="btn-outline" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                                    <span>Admin</span>
                                </Link>
                            )}
                            <Link href="/dashboard" className="btn-outline" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                                <span>My Account</span>
                            </Link>
                            <button
                                onClick={() => signOut()}
                                style={{
                                    background: "none",
                                    border: "none",
                                    color: "var(--muted)",
                                    fontSize: "0.75rem",
                                    cursor: "pointer",
                                    letterSpacing: "0.08em",
                                }}
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" style={{ textDecoration: "none", color: "var(--brown)", fontSize: "0.8rem", letterSpacing: "0.08em" }}>
                                Login
                            </Link>
                            <Link href="/booking" className="btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.78rem" }}>
                                <span>Book Now</span>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--brown)", display: "none" }}
                    className="show-mobile"
                >
                    {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div
                    style={{
                        background: "var(--cream)",
                        borderTop: "1px solid rgba(201, 168, 76, 0.2)",
                        padding: "1.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1.25rem",
                    }}
                >
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            style={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "0.9rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                textDecoration: "none",
                                color: pathname === link.href ? "var(--gold)" : "var(--brown)",
                                fontWeight: pathname === link.href ? "600" : "400",
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {session ? (
                        <>
                            <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ color: "var(--brown)", fontFamily: "Inter", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>My Account</Link>
                            <button onClick={() => { signOut(); setMobileOpen(false); }} style={{ background: "none", border: "none", textAlign: "left", color: "var(--muted)", fontSize: "0.9rem", cursor: "pointer" }}>Sign Out</button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" onClick={() => setMobileOpen(false)} style={{ color: "var(--brown)", fontFamily: "Inter", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Login</Link>
                            <Link href="/register" onClick={() => setMobileOpen(false)} style={{ color: "var(--brown)", fontFamily: "Inter", fontSize: "0.9rem", letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none" }}>Register</Link>
                            <Link href="/booking" onClick={() => setMobileOpen(false)} className="btn-primary" style={{ textAlign: "center" }}><span>Book Now</span></Link>
                        </>
                    )}
                </div>
            )}

            <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
        </header>
    );
}
