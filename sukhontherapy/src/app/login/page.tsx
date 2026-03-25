"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const result = await signIn("credentials", {
            email: form.email,
            password: form.password,
            redirect: false,
        });
        setLoading(false);
        if (result?.error) {
            setError("Invalid email or password. Please try again.");
        } else {
            router.push("/dashboard");
            router.refresh();
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                paddingTop: "80px",
                background: "var(--cream)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6rem 1.5rem 4rem",
            }}
        >
            <div style={{ width: "100%", maxWidth: "420px" }}>
                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, var(--brown), var(--brown-light))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", borderRadius: "2px" }}>
                        <Sparkles size={22} color="var(--gold-light)" />
                    </div>
                    <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.25rem", fontWeight: "400", color: "var(--brown)", marginBottom: "0.5rem" }}>
                        Welcome Back
                    </h1>
                    <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Sign in to your Sukhontherapy account</p>
                </div>

                {/* Card */}
                <div style={{ background: "var(--white)", padding: "2.5rem", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 8px 40px rgba(59,35,20,0.06)" }}>
                    {error && (
                        <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626", fontSize: "0.85rem", marginBottom: "1.25rem", borderRadius: "2px" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brown)", marginBottom: "0.5rem", fontWeight: "500" }}>
                                Email Address
                            </label>
                            <input
                                className="spa-input"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brown)", marginBottom: "0.5rem", fontWeight: "500" }}>
                                Password
                            </label>
                            <div style={{ position: "relative" }}>
                                <input
                                    className="spa-input"
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    style={{ paddingRight: "3rem" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary"
                            style={{ justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }}
                            disabled={loading}
                        >
                            <span>{loading ? "Signing in..." : "Sign In"}</span>
                            {!loading && <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                            Don&apos;t have an account?{" "}
                            <Link href="/register" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: "500" }}>
                                Create one free
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div style={{ marginTop: "1.25rem", padding: "0.75rem 1rem", background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.15)", fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.7 }}>
                        <strong style={{ color: "var(--brown)", display: "block", marginBottom: "0.3rem" }}>Demo Accounts</strong>
                        Customer: customer@demo.com / Demo1234!<br />
                        Admin: admin@sukhon.com / Admin1234!
                    </div>
                </div>
            </div>
        </div>
    );
}
