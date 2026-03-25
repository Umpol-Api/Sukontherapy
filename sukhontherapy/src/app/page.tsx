"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star, MapPin, Clock, Sparkles, Shield, Leaf } from "lucide-react";

const featuredServices = [
  {
    title: "Traditional Thai Massage",
    description: "Ancient acupressure techniques that release tension and restore energy flow throughout the body.",
    duration: "60–120 min",
    price: "from ฿600",
    icon: "✦",
  },
  {
    title: "Aromatherapy Oil Massage",
    description: "Premium essential oils blended for your mood, gliding over skin in deep, nourishing strokes.",
    duration: "60–120 min",
    price: "from ฿700",
    icon: "◈",
  },
  {
    title: "Hot Stone Therapy",
    description: "Volcanic basalt stones heated to perfection, melting deep muscle tension layer by layer.",
    duration: "90–120 min",
    price: "from ฿1,100",
    icon: "◆",
  },
];

const reviews = [
  {
    name: "Sarah M.",
    stars: 5,
    text: "Absolutely the best Thai massage in Bangkok. The ambiance is stunning and the therapists are incredibly skilled.",
    location: "Expat, Bangkok",
  },
  {
    name: "James T.",
    stars: 5,
    text: "My regular monthly retreat. Premium experience at a fair price. The hot stone therapy is truly divine.",
    location: "Professional, Phaya Thai",
  },
  {
    name: "Camille R.",
    stars: 5,
    text: "The herbal compress massage was unlike anything I've ever experienced. So healing and authentic.",
    location: "Wellness Seeker",
  },
];

const perks = [
  { icon: <Shield size={20} />, title: "Certified Therapists", desc: "All staff trained in traditional Thai healing arts" },
  { icon: <Leaf size={20} />, title: "Natural Products", desc: "Premium organic oils and herbal preparations" },
  { icon: <Sparkles size={20} />, title: "Luxury Setting", desc: "Elegant private suites in TIPCO Tower" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-animate]");
    items.forEach((item, i) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(28px)";
      setTimeout(() => {
        item.style.transition = "opacity 0.8s ease, transform 0.8s ease";
        item.style.opacity = "1";
        item.style.transform = "translateY(0)";
      }, i * 180);
    });
  }, []);

  return (
    <div style={{ overflowX: "hidden" }}>
      {/* ── Hero ── */}
      <section
        ref={heroRef}
        style={{
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #0d1f10 0%, #1a3d20 45%, #2a5c2e 100%)",
          overflow: "hidden",
        }}
      >
        {/* Ambient circles */}
        {[
          { size: 600, x: "-10%", y: "-10%", opacity: 0.06 },
          { size: 400, x: "60%", y: "40%", opacity: 0.05 },
          { size: 300, x: "80%", y: "10%", opacity: 0.04 },
        ].map((c, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: c.size,
              height: c.size,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(201,168,76,1) 0%, transparent 70%)",
              left: c.x,
              top: c.y,
              opacity: c.opacity,
              pointerEvents: "none",
            }}
          />
        ))}

        {/* Decorative lines */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "15%", left: "5%", width: "1px", height: "120px", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.4), transparent)" }} />
          <div style={{ position: "absolute", top: "20%", right: "8%", width: "1px", height: "80px", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.25), transparent)" }} />
        </div>

        {/* Hero Content */}
        <div style={{ textAlign: "center", zIndex: 1, padding: "0 1.5rem", maxWidth: "800px" }}>
          {/* Logo mark */}
          <div data-animate style={{ marginBottom: "1.25rem", display: "flex", justifyContent: "center" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              {/* Lotus SVG logo */}
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="32" r="31" stroke="rgba(201,168,76,0.4)" strokeWidth="0.8"/>
                {/* Outer petals */}
                <path d="M32 12 C28 20 24 26 32 32 C40 26 36 20 32 12Z" fill="rgba(201,168,76,0.18)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.7"/>
                <path d="M12 32 C20 28 26 24 32 32 C26 40 20 36 12 32Z" fill="rgba(201,168,76,0.18)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.7"/>
                <path d="M52 32 C44 28 38 24 32 32 C38 40 44 36 52 32Z" fill="rgba(201,168,76,0.18)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.7"/>
                <path d="M32 52 C28 44 24 38 32 32 C40 38 36 44 32 52Z" fill="rgba(201,168,76,0.18)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.7"/>
                {/* Inner petals */}
                <path d="M18 18 C22 24 26 26 32 32 C26 26 24 22 18 18Z" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.6"/>
                <path d="M46 18 C40 24 38 26 32 32 C38 26 40 22 46 18Z" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.6"/>
                <path d="M18 46 C22 40 26 38 32 32 C26 38 24 40 18 46Z" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.6"/>
                <path d="M46 46 C40 40 38 38 32 32 C38 38 40 40 46 46Z" fill="rgba(201,168,76,0.25)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.6"/>
                {/* Centre dot */}
                <circle cx="32" cy="32" r="3.5" fill="var(--gold)" opacity="0.9"/>
              </svg>
            </div>
          </div>

          <div data-animate style={{ marginBottom: "1.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.4rem 1rem",
                border: "1px solid rgba(201, 168, 76, 0.35)",
                color: "var(--gold)",
                fontFamily: "Inter, sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              <Sparkles size={11} />
              TIPCO Tower · Bangkok · Est. 2018
            </span>
          </div>

          <h1
            data-animate
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(3rem, 9vw, 6.5rem)",
              fontWeight: "300",
              color: "#fdfaf6",
              lineHeight: 1.05,
              letterSpacing: "-0.01em",
              marginBottom: "0.25rem",
            }}
          >
            Sukhon
            <span
              style={{
                display: "block",
                background: "linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                fontStyle: "italic",
              }}
            >
              therapy
            </span>
          </h1>

          <p
            data-animate
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)",
              color: "rgba(245, 239, 230, 0.7)",
              marginBottom: "0.75rem",
              fontStyle: "italic",
              letterSpacing: "0.04em",
            }}
          >
            Massage & Spa
          </p>

          <div data-animate style={{ marginBottom: "2.5rem" }}>
            <div className="gold-divider" />
            <p
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(0.85rem, 2vw, 1rem)",
                color: "rgba(245, 239, 230, 0.6)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginTop: "1rem",
              }}
            >
              Relax &nbsp;·&nbsp; Restore &nbsp;·&nbsp; Rebalance
            </p>
          </div>

          <div data-animate style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/booking" className="btn-primary">
              <span>Reserve Your Session</span>
              <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
            </Link>
            <Link href="/services" className="btn-outline" style={{ color: "var(--gold-light)", borderColor: "rgba(201,168,76,0.5)" }}>
              <span>View Services</span>
            </Link>
          </div>

          {/* Stars */}
          <div data-animate style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginTop: "2.5rem" }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="var(--gold)" color="var(--gold)" />
            ))}
            <span style={{ color: "rgba(220,240,220,0.7)", fontSize: "0.8rem", marginLeft: "0.25rem" }}>
              4.8 · 200+ reviews
            </span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, rgba(201,168,76,0.6), transparent)", animation: "fadeIn 2s ease infinite alternate" }} />
          <span style={{ color: "rgba(201,168,76,0.45)", fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>Scroll</span>
        </div>
      </section>

      {/* ── About Preview ── */}
      <section style={{ padding: "7rem 1.5rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
          <div>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Our Story</p>
            <h2 className="section-title" style={{ marginBottom: "1.5rem", color: "var(--green)" }}>
              Where Ancient Wisdom Meets Modern Luxury
            </h2>
            <div className="gold-divider" style={{ margin: "0 0 1.5rem 0" }} />
            <p style={{ color: "var(--muted)", lineHeight: 1.85, marginBottom: "1.25rem", fontSize: "0.95rem" }}>
              Nestled within TIPCO Tower in the vibrant Phaya Thai district, Sukhontherapy was born from a deep reverence for Thailand's ancient healing traditions. Every treatment is a conversation between therapist and guest — intuitive, personal, and transformative.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.85, marginBottom: "2rem", fontSize: "0.95rem" }}>
              Our women-owned sanctuary welcomes all — professionals seeking respite, couples craving shared serenity, wellness seekers and explorers. Here, you are always seen and celebrated.
            </p>
            <Link href="/services" className="btn-primary">
              <span>Explore Our Services</span>
              <ArrowRight size={14} style={{ position: "relative", zIndex: 1 }} />
            </Link>
          </div>

          {/* Image mosaic placeholder */}
          <div style={{ position: "relative", height: "460px" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: 0, bottom: "15%", background: "linear-gradient(135deg, var(--brown-light), var(--brown))", borderRadius: "2px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center", color: "rgba(245,239,230,0.6)" }}>
                <Sparkles size={48} color="var(--gold)" style={{ marginBottom: "1rem", opacity: 0.7 }} />
                <p style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.25rem", color: "var(--gold-light)", opacity: 0.7 }}>Sukhontherapy Studio</p>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, width: "45%", height: "45%", background: "var(--gold)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "2rem", fontWeight: "600", color: "var(--brown)" }}>8+</div>
                <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--brown)", opacity: 0.7 }}>Years of Healing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Perks ── */}
      <section style={{ padding: "5rem 1.5rem", background: "var(--green)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a84c' fill-opacity='0.04'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2.5rem", position: "relative" }}>
          {perks.map((p, i) => (
            <div key={i} style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ width: "52px", height: "52px", background: "rgba(201,168,76,0.12)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem", color: "var(--gold)" }}>
                {p.icon}
              </div>
              <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.25rem", color: "var(--gold-light)", marginBottom: "0.5rem" }}>{p.title}</h3>
              <p style={{ color: "rgba(220,240,220,0.75)", fontSize: "0.85rem", lineHeight: 1.7 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Services ── */}
      <section style={{ padding: "7rem 1.5rem", background: "var(--white)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>Signature Treatments</p>
            <h2 className="section-title">Crafted for Your Wellbeing</h2>
            <div className="gold-divider" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {featuredServices.map((svc, i) => (
              <div key={i} className="spa-card" style={{ padding: "2.5rem" }}>
                <div style={{ fontSize: "1.75rem", color: "var(--gold)", marginBottom: "1rem", fontFamily: "serif" }}>{svc.icon}</div>
                <h3 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.4rem", fontWeight: "500", color: "var(--brown)", marginBottom: "0.75rem" }}>
                  {svc.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.5rem" }}>
                  {svc.description}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(201,168,76,0.15)", paddingTop: "1.25rem" }}>
                  <div>
                    <div style={{ fontSize: "0.7rem", fontFamily: "Inter", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: "0.2rem" }}>{svc.duration}</div>
                    <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1.1rem", color: "var(--gold)" }}>{svc.price}</div>
                  </div>
                  <Link href="/booking" className="btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.75rem" }}>
                    <span>Book</span>
                    <ArrowRight size={12} style={{ position: "relative", zIndex: 1 }} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <Link href="/services" className="btn-outline">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section style={{ padding: "7rem 1.5rem", background: "var(--cream-dark)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p className="section-label" style={{ marginBottom: "0.75rem" }}>What Guests Say</p>
            <h2 className="section-title" style={{ color: "var(--green)" }}>Stories of Serenity</h2>
            <div className="gold-divider" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: "var(--white)", padding: "2rem", border: "1px solid rgba(201,168,76,0.15)", position: "relative" }}>
                <div style={{ position: "absolute", top: "1.25rem", right: "1.5rem", fontFamily: "Georgia, serif", fontSize: "4rem", color: "var(--gold)", lineHeight: 1, opacity: 0.15 }}>"</div>
                <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem" }}>
                  {[...Array(r.stars)].map((_, j) => (
                    <Star key={j} size={13} fill="var(--gold)" color="var(--gold)" />
                  ))}
                </div>
                <p style={{ color: "var(--muted)", fontSize: "0.875rem", lineHeight: 1.75, marginBottom: "1.25rem", fontStyle: "italic" }}>"{r.text}"</p>
                <div>
                  <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "1rem", fontWeight: "600", color: "var(--brown)" }}>{r.name}</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em" }}>{r.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Info bar ── */}
      <section style={{ padding: "2.5rem 1.5rem", background: "var(--gold)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--brown)" }}>
            <MapPin size={16} />
            <span style={{ fontFamily: "Inter", fontSize: "0.82rem", letterSpacing: "0.05em" }}>TIPCO Tower, 118/1 Rama VI Rd, Phaya Thai</span>
          </div>
          <div style={{ width: "1px", height: "20px", background: "rgba(59,35,20,0.25)" }} />
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--brown)" }}>
            <Clock size={16} />
            <span style={{ fontFamily: "Inter", fontSize: "0.82rem", letterSpacing: "0.05em" }}>Daily 10:00 AM – 8:00 PM</span>
          </div>
          <div style={{ width: "1px", height: "20px", background: "rgba(59,35,20,0.25)" }} />
          <a href="tel:0823264549" style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--brown)", textDecoration: "none" }}>
            <span style={{ fontFamily: "Inter", fontSize: "0.82rem", letterSpacing: "0.05em" }}>082-326-4549</span>
          </a>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section style={{ padding: "8rem 1.5rem", background: "linear-gradient(160deg, var(--green-dark) 0%, var(--green) 100%)", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <p className="section-label" style={{ marginBottom: "1rem" }}>Ready to Restore?</p>
          <h2 style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(2rem, 6vw, 4rem)", fontWeight: "300", color: "var(--white)", marginBottom: "1rem" }}>
            Your Journey Begins with
            <span style={{ display: "block", background: "linear-gradient(135deg, var(--gold), var(--gold-light))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", fontStyle: "italic" }}>
              One Booking
            </span>
          </h2>
          <p style={{ color: "rgba(245,239,230,0.55)", fontFamily: "Inter", fontSize: "0.9rem", letterSpacing: "0.08em", marginBottom: "2.5rem" }}>
            Reserve in under 3 minutes. Choose your service, therapist, and time.
          </p>
          <Link href="/booking" className="btn-primary" style={{ fontSize: "0.9rem", padding: "1rem 2.5rem" }}>
            <span>Book Your Session Now</span>
            <ArrowRight size={16} style={{ position: "relative", zIndex: 1 }} />
          </Link>
        </div>
      </section>
    </div>
  );
}
