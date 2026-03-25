import { MapPin, Phone, Clock, MessageCircle, Mail } from "lucide-react";

export const metadata = {
    title: "Contact Us | Sukhontherapy Massage & Spa",
    description: "Visit Sukhontherapy at TIPCO Tower, Bangkok. Call 082-326-4549 or reach us on LINE. Open daily 10:00 AM – 8:00 PM.",
};

export default function ContactPage() {
    return (
        <div style={{ paddingTop: "80px", background: "var(--cream)", minHeight: "100vh" }}>
            {/* Hero */}
            <section style={{ padding: "5rem 1.5rem 3rem", background: "linear-gradient(160deg, var(--brown) 0%, var(--brown-light) 100%)", textAlign: "center" }}>
                <p className="section-label" style={{ marginBottom: "0.75rem", color: "var(--gold)" }}>Find Us</p>
                <h1 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", fontWeight: "300", color: "var(--white)", marginBottom: "1rem" }}>
                    Come &amp; Visit
                </h1>
                <div className="gold-divider" />
            </section>

            <section style={{ padding: "5rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
                    {/* Contact Info */}
                    <div>
                        <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: "400", color: "var(--brown)", marginBottom: "2rem" }}>
                            Get in Touch
                        </h2>

                        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                            {/* Address */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MapPin size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.25rem" }}>Location</div>
                                    <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.65 }}>
                                        TIPCO Tower, 118/1 Rama VI Rd,<br />
                                        Phaya Thai, Bangkok 10400
                                    </p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Phone size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.25rem" }}>Phone</div>
                                    <a href="tel:0823264549" style={{ color: "var(--muted)", fontSize: "0.9rem", textDecoration: "none" }}>
                                        082-326-4549
                                    </a>
                                </div>
                            </div>

                            {/* LINE */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <MessageCircle size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.25rem" }}>LINE</div>
                                    <a href="https://line.me/ti/p/@sukhontherapy" style={{ color: "var(--muted)", fontSize: "0.9rem", textDecoration: "none" }}>
                                        @sukhontherapy
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Mail size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.25rem" }}>Email</div>
                                    <a href="mailto:hello@sukhontherapy.com" style={{ color: "var(--muted)", fontSize: "0.9rem", textDecoration: "none" }}>
                                        hello@sukhontherapy.com
                                    </a>
                                </div>
                            </div>

                            {/* Hours */}
                            <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                                <div style={{ width: "44px", height: "44px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Clock size={18} color="var(--gold)" />
                                </div>
                                <div>
                                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.5rem" }}>Opening Hours</div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                                        {[
                                            { day: "Monday – Friday", time: "10:00 AM – 8:00 PM" },
                                            { day: "Saturday – Sunday", time: "10:00 AM – 8:00 PM" },
                                            { day: "Public Holidays", time: "10:00 AM – 6:00 PM" },
                                        ].map((h) => (
                                            <div key={h.day} style={{ display: "flex", justifyContent: "space-between", gap: "2rem", fontSize: "0.875rem" }}>
                                                <span style={{ color: "var(--brown)", fontWeight: "500" }}>{h.day}</span>
                                                <span style={{ color: "var(--muted)" }}>{h.time}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map + contact form */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                        {/* Google Maps embed */}
                        <div style={{ overflow: "hidden", border: "1px solid rgba(201,168,76,0.2)", aspectRatio: "4/3" }}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.5985748984077!2d100.5381!3d13.7633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ecd!2sTIPCO+Tower!5e0!3m2!1sen!2sth!4v1234567890"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Sukhontherapy location map"
                            />
                        </div>

                        {/* Quick contact form */}
                        <div style={{ background: "var(--white)", padding: "2rem", border: "1px solid rgba(201,168,76,0.15)" }}>
                            <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", color: "var(--brown)", marginBottom: "1.5rem" }}>Send a Message</h3>
                            <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    <input className="spa-input" placeholder="Your Name" type="text" />
                                    <input className="spa-input" placeholder="Email" type="email" />
                                </div>
                                <input className="spa-input" placeholder="Subject" type="text" />
                                <textarea
                                    className="spa-input"
                                    placeholder="Your message..."
                                    rows={4}
                                    style={{ resize: "none" }}
                                />
                                <button type="submit" className="btn-primary" style={{ justifyContent: "center" }}>
                                    <span>Send Message</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
