import { Fade } from "../utils/Fade";
import COLORS from "../constants/colors";
import { useState } from "react";
export function About() {
  const features = [
    { icon: "🧠", title: "Smart Prediction", desc: "Advanced ML algorithms analyze your inputs to provide a personalized PCOD risk score with high accuracy." },
    { icon: "🔔", title: "Early Awareness", desc: "Identify potential risk factors early so you can take proactive steps and consult your healthcare provider." },
    { icon: "🔒", title: "Privacy Focused", desc: "Your data stays yours. We never store or share personal health information. Complete anonymity guaranteed." },
  ];

  return (
    <section id="about" style={{ padding: "100px 24px", background: "#fff" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <Fade>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <h1>About PCOD</h1>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(28px,4vw,42px)", fontWeight: 700, color: COLORS.text, marginBottom: 16 }}>
              What is PCOD?
            </h2>
            <p style={{ fontSize: 17, color: "#6B7280", maxWidth: 640, margin: "0 auto", lineHeight: 1.8 }}>
              Polycystic Ovarian Disease (PCOD) is a common hormonal condition affecting millions of women. Early detection through risk assessment enables timely lifestyle changes and medical consultation.
            </p>
            <div style={{ marginTop: 16, padding: "12px 20px", background: "rgba(46,196,182,0.08)", border: "1px solid rgba(46,196,182,0.25)", borderRadius: 12, display: "inline-block" }}>
              <p style={{ fontSize: 13, color: "#0D7A73", fontWeight: 600 }}>
                ⚠️ Rutuchakra provides risk prediction, not medical diagnosis. Always consult a qualified healthcare professional.
              </p>
            </div>
          </div>
        </Fade>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 28 }}>
          {features.map((f, i) => (
            <Fade key={f.title} delay={i * 0.15}>
              <FeatureCard {...f} />
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding: 32, borderRadius: 20,
        background: hov ? `linear-gradient(135deg, #faf7ff, #f0e6ff)` : "#F8F9FA",
        border: `1px solid ${hov ? "rgba(123,44,191,0.25)" : "rgba(0,0,0,0.06)"}`,
        boxShadow: hov ? "0 16px 48px rgba(123,44,191,0.12)" : "0 2px 12px rgba(0,0,0,0.04)",
        transition: "all 0.35s ease", transform: hov ? "translateY(-6px)" : "none",
        cursor: "default",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{icon}</div>
      <h3 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, marginBottom: 10, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
      <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}
