import { Fade } from "../utils/Fade";
import COLORS from "../constants/colors";
import { useState } from "react";

export function WhyChoose() {
  const items = [
    { icon: "🎯", title: "Accurate Prediction Model", desc: "Built with clinically-informed features and validated data patterns for reliable risk assessment." },
    { icon: "✨", title: "Simple Interface", desc: "Clean, intuitive design that guides you through the process with ease — no medical jargon." },
    { icon: "🛡️", title: "Secure & Private", desc: "Zero data storage policy. Your health information is processed locally and never transmitted." },
    { icon: "⚡", title: "Fast Results", desc: "Get your risk prediction report in under 60 seconds — anytime, anywhere, on any device." },
  ];

  return (
    <section id="contact" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h1>Why Us</h1>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
              Why Choose Rutuchakra?
            </h2>
          </div>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {items.map((item, i) => (
            <Fade key={item.title} delay={i * 0.12}>
              <WhyCard {...item} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: "28px 24px", borderRadius: 20,
        background: hov ? `linear-gradient(135deg, rgba(123,44,191,0.05), rgba(46,196,182,0.05))` : "#F8F9FA",
        border: `1px solid ${hov ? "rgba(123,44,191,0.2)" : "rgba(0,0,0,0.05)"}`,
        transition: "all 0.3s ease", transform: hov ? "scale(1.02)" : "scale(1)",
        boxShadow: hov ? "0 12px 40px rgba(123,44,191,0.1)" : "none",
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 14 }}>{icon}</div>
      <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}