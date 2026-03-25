"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password !== form.confirm) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError("");
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone, password: form.password }),
        });
        const data = await res.json();
        setLoading(false);
        if (!res.ok) {
            setError(data.error || "Registration failed.");
        } else {
            router.push("/login?registered=1");
        }
    };

    return (
        <div style={{ minHeight: "100vh", paddingTop: "80px", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem 4rem" }}>
            <div style={{ width: "100%", maxWidth: "460px" }}>
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <div style={{ width: "52px", height: "52px", background: "linear-gradient(135deg, var(--brown), var(--brown-light))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", borderRadius: "2px" }}>
                        <Sparkles size={22} color="var(--gold-light)" />
                    </div>
                    <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2.25rem", fontWeight: "400", color: "var(--brown)", marginBottom: "0.5rem" }}>Create Account</h1>
                    <p style={{ color: "var(--muted)", fontSize: "0.875rem" }}>Join Sukhontherapy for seamless booking & exclusive packages</p>
                </div>

                <div style={{ background: "var(--white)", padding: "2.5rem", border: "1px solid rgba(201,168,76,0.2)", boxShadow: "0 8px 40px rgba(59,35,20,0.06)" }}>
                    {error && (
                        <div style={{ padding: "0.75rem 1rem", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#dc2626", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.15rem" }}>
                        {[
                            { key: "name", label: "Full Name", type: "text", placeholder: "Jane Smith" },
                            { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
                            { key: "phone", label: "Phone (optional)", type: "tel", placeholder: "083-456-7890" },
                        ].map((f) => (
                            <div key={f.key}>
                                <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brown)", marginBottom: "0.5rem", fontWeight: "500" }}>{f.label}</label>
                                <input className="spa-input" type={f.type} placeholder={f.placeholder} value={(form as any)[f.key]} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} required={f.key !== "phone"} />
                            </div>
                        ))}

                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brown)", marginBottom: "0.5rem", fontWeight: "500" }}>Password</label>
                            <div style={{ position: "relative" }}>
                                <input className="spa-input" type={showPass ? "text" : "password"} placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} style={{ paddingRight: "3rem" }} />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--brown)", marginBottom: "0.5rem", fontWeight: "500" }}>Confirm Password</label>
                            <input className="spa-input" type="password" placeholder="••••••••" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} required />
                        </div>

                        <button type="submit" className="btn-primary" style={{ justifyContent: "center", marginTop: "0.5rem", opacity: loading ? 0.7 : 1 }} disabled={loading}>
                            <span>{loading ? "Creating account..." : "Create My Account"}</span>
                            {!loading && <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />}
                        </button>
                    </form>

                    <div style={{ textAlign: "center", marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
                        <p style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                            Already have an account?{" "}
                            <Link href="/login" style={{ color: "var(--gold)", textDecoration: "none", fontWeight: "500" }}>Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
